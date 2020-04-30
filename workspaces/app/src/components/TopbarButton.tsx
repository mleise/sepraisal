import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Button, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../common/'
import { ROUTES } from '../constants/routes'
import { CONTEXT } from '../stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        color: theme.palette.primary.contrastText,
        borderColor: theme.palette.primary.contrastText,
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        minWidth: 56,
    },
    title: {
        overflow: 'hidden',
        transition: theme.transitions.create('max-width'),
        maxWidth: 0,
        [theme.breakpoints.up('md')]: {
            maxWidth: 80,
        },
    },
})


interface IProps {
        icon: JSX.Element
        route: ROUTES
        title: string
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const routerStore = React.useContext(CONTEXT.ROUTER)

    const h = (event: React.MouseEvent) => {
        // tslint:disable-next-line: no-non-null-assertion
        const path = event.currentTarget.getAttribute('value')!
        routerStore.goView(path)
    }

    return (
        <Button
            variant='outlined'
            className={classes.root}
            onClick={h}
            value={props.route}
        >
            {props.icon}
            <Typography
                className={classes.title}
                variant='button'
            >
                {props.title}
            </Typography>
        </Button>
    )
})) /* ============================================================================================================= */
