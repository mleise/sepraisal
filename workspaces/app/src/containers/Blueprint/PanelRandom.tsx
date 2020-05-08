import { getApiUrl } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Button, FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from '@material-ui/core'

import { ASYNC_STATE, createSmartFC, createStyles, IMyTheme } from 'src/common'
import { getPresetTitle, PRESET } from 'src/stores/CardStore'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    button: {
        margin: theme.spacing(1),
        minWidth: 240,
        maxWidth: 240,
        alignSelf: 'left',
    },
    label: {
        ...theme.typography.subtitle2,
        color: theme.palette.text.primary,
        '& > span': {
            color: theme.palette.error.main,
        },
    },
    helper: {
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const [value, setValue] = React.useState<keyof typeof PRESET | null>(null);
    const [status, setStatus] = React.useState<{code: ASYNC_STATE, text: string}>({code: ASYNC_STATE.Idle, text: ''})

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value as keyof typeof PRESET);
        setStatus({code: ASYNC_STATE.Idle, text: ''})
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(value === null) {
            setStatus({code: ASYNC_STATE.Error, text: 'Please select an option.'})
            return
        }

        const preset = PRESET[value]
        setStatus({code: ASYNC_STATE.Doing, text: 'Randomizing blueprint id ...'})
        try {
            const skip = Math.floor(Math.random() * 3800)  // Random blueprint out of first 90k blueprints.
            const res = await fetch(getApiUrl(preset, {_id: true}, undefined, 1, skip))
            const {docs} = await res.json() as {docs: [{_id: number}]}
            const id = docs[0]._id
            // setText(id.toString())
            // select(id)
            setStatus({code: ASYNC_STATE.Done, text: 'Random ID selected!'})
        } catch(err) {
            setStatus({code: ASYNC_STATE.Error, text: `Randomizer: ${err.message}`})
        }
    };

    return (
        <form className={classes.root} onSubmit={handleSubmit}>
            <FormControl component='fieldset' error={status.code === ASYNC_STATE.Error}>
                <FormLabel component='legend' className={classes.label}>Or analyse a random blueprint:</FormLabel>
                <RadioGroup aria-label='quiz' name='quiz' value={value} onChange={handleRadioChange}>
                    {Object.keys(PRESET).map((name) => (
                        <FormControlLabel
                            value={name}
                            control={<Radio color='primary' size='small' />}
                            label={getPresetTitle(name as keyof typeof PRESET)}
                        />
                    ))}
                </RadioGroup>
                <FormHelperText>{status.text}</FormHelperText>
                <Button type='submit' variant='outlined' color='primary' className={classes.button}>
                    Analyse Random
                </Button>
            </FormControl>
        </form>
    );
})) /* ============================================================================================================= */
