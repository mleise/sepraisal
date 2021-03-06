import { computed } from 'mobx'
import { join } from 'path'


declare interface IWindowWithPiwik extends Window {
    _paq: unknown[][]
}
declare let window: IWindowWithPiwik & typeof globalThis

const noop = () => undefined


export interface IAnalyticsStoreOpts {
    trackErrorHandler?: AbstractAnalyticsStore['trackError'],
    trackErrors?: boolean,
    url?: string,
}

export abstract class AbstractAnalyticsStore {
    @computed public get isLoaded(): boolean {
        // This store sets `_paq` as simple Array.
        // Injected Piwik code will replace it with specialized class which is not Array.
        // TODO: Distinguish between "not yet loaded" vs "blocked by adblock".
        return !Array.isArray(window._paq)
    }

    protected readonly _isShim: boolean = false
    protected listeners: Array<() => void> = []
    protected previousPath = ''
    protected url: string | null

    public constructor(rawOpts: IAnalyticsStoreOpts = {}) {
        this.url = rawOpts.url || null

        const trackErrorHandler = this.trackError.bind(this)
        if (rawOpts.trackErrors) {
            if (window.addEventListener) {
                window.addEventListener('error', trackErrorHandler, false)
                this.listeners.push(() => window.removeEventListener('error', trackErrorHandler))
            } else {
                const prev = window.onerror
                window.onerror = trackErrorHandler
                this.listeners.push(() => window.onerror = prev)
            }
        }

        // api shim. used for serverside rendering, misconfigured trackers, or in development environment.
        if (this.url === null) {
            console.debug('AnalyticsStore: using shim.')
            this._isShim = true

            return
        }
    }

    public deconstructor(): void {
        this.listeners.forEach((listener) => listener())
    }

    protected abstract push(args: ['trackPageView']): void
    protected abstract push(args: ['trackEvent']): void
    protected abstract push(args: ['trackEvent', string]): void
    protected abstract push(args: ['trackEvent', string, string]): void
    protected abstract push(args: ['trackEvent', string, string, string | number]): void
    protected abstract push(args: ['trackEvent', string, string, string, string | number]): void
    protected abstract push(args: ['trackSiteSearch', string, string, number]): void
    // public abstract push(args: ['trackPageView' | 'trackEvent' | 'trackSiteSearch', string?, string?, (string | number)?])

    /**
    * Adds a page view for the given location
    */
    public trackView(location: Location | {path: string} | Location & {basename: string}): void {
        let currentPath: string

        if ('path' in location) {
            currentPath = location.path
        } else if ('basename' in location) {
            currentPath = join(location.basename, location.pathname, location.search)
        } else {
            currentPath = join(location.pathname, location.search)
        }

        if (this.previousPath === currentPath) return

        this.previousPath = currentPath
        this.push(['trackPageView'])
    }

    public trackEvent(category: string, action?: string, name?: string, value?: string | number): void {
        if(value !== undefined) {
            if(typeof name === 'undefined') throw new Error('AnalyticsStore.trackEvent requires name when value is provided.')
            if(typeof action === 'undefined') throw new Error('AnalyticsStore.trackEvent requires action when value is provided.')
            this.push(['trackEvent', category, action, name, value])
        } else if(name !== undefined) {
            if(typeof action === 'undefined') throw new Error('AnalyticsStore.trackEvent requires action when name is provided.')
            this.push(['trackEvent', category, action, name])
        } else if(action !== undefined) {
            this.push(['trackEvent', category, action])
        } else {
            this.push(['trackEvent', category])
        }
    }

    public trackSiteSearch(keyword: string, category: string, count: number): void {
        this.push([
            'trackSiteSearch',
            keyword,
            category,
            count,
        ])
    }

    /**
    * Tracks occurring javascript errors as a `JavaScript Error` piwik event.
    *
    * @see http://davidwalsh.name/track-errors-google-analytics
    */
    public trackError(event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error): void
    public trackError(errorEvent: ErrorEvent, eventName?: string): void
    public trackError(eventSomething: ErrorEvent | Event | string, sourceOrEventName?: string, lineno?: number, colno?: number, error?: Error): void {
        if(typeof eventSomething === 'string') {
            this.push([
                'trackEvent',
                'JavaScript Error',
                eventSomething,
                `${sourceOrEventName}:${lineno}:${colno}`,
            ])
        } else if(!('message' in eventSomething)) {
            this.push([
                'trackEvent',
                'JavaScript Error',
                error?.message ?? '',
                `${sourceOrEventName}:${lineno}:${colno}`,
            ])
        } else {
            this.push([
                'trackEvent',
                sourceOrEventName ?? 'JavaScript Error',
                eventSomething.message,
                `${eventSomething.filename}:${eventSomething.lineno}`,
            ])

        }
    }

}
