import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Button, Grid, Paper, Typography } from '@material-ui/core'
import IconBuild from '@material-ui/icons/Build'
import IconSearch from '@material-ui/icons/Search'

import * as banner from '../../static/Space Engineers - Red vs. Blue - IratusAvis.jpg'
import { API_URL, createSmartFC, createStyles, IMyTheme } from '../common/'
import { ROUTES } from '../constants/routes'
import { CONTEXT } from '../stores'
import { PRESET } from '../stores/CardStore'
import { STATUS } from './Blueprint'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        padding: '0.5em',
    },

    banner: {
        backgroundImage: `url('${banner}')`,
        backgroundPositionY: `45%`,
        backgroundSize: `cover`,
        height: theme.spacing(50),
    },
    content: {
        padding: '0.5em',
    },
})


interface IProps {
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const routerStore = React.useContext(CONTEXT.ROUTER)

    const [status, setStatus] = React.useState<typeof STATUS[keyof typeof STATUS]>(STATUS.Idle)
    const [blueprint, setBlueprint] = React.useState<IBlueprint | null>(null)

    const getRandom = async () => {
        setStatus(STATUS.Loading)
        try {
            const projection = encodeURIComponent(JSON.stringify({}))
            const find = encodeURIComponent(JSON.stringify(PRESET.none))
            const skip = Math.floor(Math.random() * 1000)
            const res = await fetch(`${API_URL}?find=${find}&limit=${1}&skip=${skip}&projection=${projection}`)
            const {docs} = await res.json() as {docs: Array<Required<IBlueprint>>}
            const doc = docs.pop()!
            routerStore.push(`${ROUTES.BLUEPRINT}/${doc._id}`)
        } catch(err) {
            setStatus(STATUS.Failed)
        }
    }

    return (<>
        <Grid container spacing={2} justify='center' className={classes.root} style={{paddingBottom: 0}}>
            <Grid item xs={12} lg={9}>
                <Paper className={classes.banner}>
                </Paper>
            </Grid>
        </Grid>
        <Grid container spacing={2} justify='center' className={classes.root}>
            <Grid item xs={12} sm={8} md={4} lg={3}>
                <Paper className={classes.content}>
                    <Typography variant='h4' gutterBottom>1. Browse</Typography>
                    <Button
                        color='primary'
                        variant='contained'
                        onClick={() => routerStore.push(ROUTES.BROWSE)}
                        fullWidth
                    >
                        <IconSearch />
                        <Typography variant='button'>{'Browse'}</Typography>
                    </Button>
                    <Typography paragraph>
                        Browse all Steam workshop blueprints!
                    </Typography>
                    <Typography paragraph>
                        Features:
                        <ul>
                            <li><strong>Filters</strong>: vanilla-ness, blocks, PCU, required ores, etc.</li>
                            <li><strong>Text search</strong>: narrow down by title, author, etc.</li>
                            <li><strong>Sort</strong>: by subscribers, blocks, PCU, and required ore.</li>
                        </ul>
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={8} md={4} lg={3}>
                <Paper className={classes.content}>
                    <Typography variant='h4' gutterBottom>2. Analyse</Typography>
                    <Button
                        variant='contained'
                        onClick={getRandom}
                        fullWidth
                    >
                        <IconSearch />
                        <Typography variant='button'>{'Random Blueprint'}</Typography>
                    </Button>
                    <Typography paragraph>
                        Get in-depth analysis of the blueprint!
                    </Typography>
                    <Typography paragraph>
                        Features:
                        <ul>
                            <li><strong>2D x-ray</strong>: Bad picture? View it in three projections.</li>
                            <li><strong>Costs</strong>: list all required components, ingots and ores.</li>
                            <li><strong>Stats</strong>: Precalculated values of most important stats.</li>
                        </ul>
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={8} md={4} lg={3}>
                <Paper className={classes.content}>
                    <Typography variant='h4' gutterBottom>3. Compare</Typography>
                    <Button
                        variant='contained'
                        onClick={() => routerStore.push(ROUTES.WORKBENCH)}
                        fullWidth
                    >
                        <IconBuild />
                        <Typography variant='button'>{'Compare view'}</Typography>
                    </Button>
                    <Typography paragraph>
                        Compare blueprints side-to-side!
                    </Typography>
                    <Typography paragraph>
                        Features:
                        <ul>
                            <li><strong>Offline blueprints</strong>: Add your offline blueprint to comparison.</li>
                            <li><strong>Recent</strong>: Easy access to recently viewed blueprints.</li>
                            <li><strong>Unlimited</strong>: Compare as many blueprints as you can.</li>
                        </ul>
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    </>)
})) /* ============================================================================================================= */