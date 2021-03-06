import clsx from 'clsx'
import { runInAction } from 'mobx'
import moment from 'moment'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { darken, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import FavoriteButton from 'src/components/FavoriteButton'
import { CONTEXT } from 'src/stores'

import FromNow from './FromNow'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        margin: theme.spacing(1, 0),
        paddingRight: 128,
    },

    listItemText: {
    },
    selected: {
        '&:hover': {
            background: darken(theme.palette.background.default, 0.1),
        },
        'background': theme.palette.background.default,
    },
})


interface IProps {
    id: string | number
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {id} = props
    const blueprintStore = React.useContext(CONTEXT.BLUEPRINTS)
    const analyticsStore = React.useContext(CONTEXT.ANALYTICS)
    const selectionStore = React.useContext(CONTEXT.SELECTION)

    const blueprint = blueprintStore.getSomething(id)
    const title = String(blueprint?.steam?.title ?? id)
    const index = selectionStore.selected.indexOf(id)

    const handleToggle = () => {
        if(index === -1) {
            runInAction(() => selectionStore.selected.push(id))
            analyticsStore.trackEvent(
                'workshop',
                id === title ? 'selectUpload' : 'selectRecent',
                String(id),
                undefined,
            )
        } else {
            analyticsStore.trackEvent(
                'workshop',
                id === title ? 'deselectUpload' : 'deselectRecent',
                String(id),
                undefined,
            )
            runInAction(() => selectionStore.selected.remove(id))
        }
    }
    const handleDelete = () => {
        analyticsStore.trackEvent(
            'workshop',
            id === title ? 'deleteUpload' : 'deleteRecent',
            String(id),
            undefined,
        )
        runInAction(() => {
            selectionStore.selected.remove(id)
            blueprintStore.deleteSomething(id)
        })
    }

    return (
        <ListItem
            button
            key={id}
            className={clsx(classes.root, index === -1 ? '' : classes.selected)}
            onClick={handleToggle}
        >
            <ListItemText
                primary={title}
                primaryTypographyProps={{variant: 'body1'}}
            />
            <ListItemSecondaryAction>
                <FromNow variant='caption' moment={blueprint?._cached ?? moment()} />
                <FavoriteButton bpId={id} name={title} edge='end' />
            </ListItemSecondaryAction>
        </ListItem>
    )
})) /* ============================================================================================================= */
