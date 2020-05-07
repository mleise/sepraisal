import { idFromHref } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { useLocation } from 'react-router-dom'

import { Grid } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import Analysis from '../../components/Analysis'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const location = useLocation()

    let content: [React.ReactElement] | null = null
    try {
        const id = idFromHref(location.search)
        // Use `key` prop so it doesn't reuse Analysis for different ids.
        content = [<Analysis bpId={id} key={id} long />]
    } catch(err) {
    }

    return (
        <Grid container spacing={2} justify='center'>
            {content}
        </Grid>
    )
})) /* ============================================================================================================= */