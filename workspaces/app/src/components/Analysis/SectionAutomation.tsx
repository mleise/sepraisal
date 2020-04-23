import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import ValueCell from '../../components/Cell/ValueCell'
import HeaderCell from '../Cell/HeaderCell'
import MyBox from '../MyBox'
import MyBoxGroup from '../MyBoxGroup'
import MySection from '../MySection'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
})


interface IProps {
    bp: IBpProjectionRow
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {sbc} = props.bp

    const progBlocks = (sbc.blocks['MyProgrammableBlock/LargeProgrammableBlock'] ?? 0) + (sbc.blocks['ProgrammableBlock/SmallProgrammableBlock'] ?? 0)
    const sensors = (sbc.blocks['SensorBlock/LargeBlockSensor'] ?? 0) + (sbc.blocks['SensorBlock/SmallBlockSensor'] ?? 0)
    const timers = (sbc.blocks['TimerBlock/TimerBlockLarge'] ?? 0) + (sbc.blocks['TimerBlock/TimerBlockSmall'] ?? 0)

    const projectors = (sbc.blocks['MyObjectBuilder_Projector/LargeProjector'] ?? 0) + (sbc.blocks['MyObjectBuilder_Projector/SmallProjector'] ?? 0)
    const soundBlocks = (sbc.blocks['SoundBlock/SmallBlockSoundBlock'] ?? 0) + (sbc.blocks['SoundBlock/LargeBlockSoundBlock'] ?? 0)
    const buttons = (sbc.blocks['ButtonPanel/ButtonPanelLarge'] ?? 0) + (sbc.blocks['ButtonPanel/ButtonPanelSmall'] ?? 0)
    const sorters = (sbc.blocks['ConveyorSorter/LargeBlockConveyorSorter'] ?? 0)
        + (sbc.blocks['ConveyorSorter/MediumBlockConveyorSorter'] ?? 0)
        + (sbc.blocks['ConveyorSorter/SmallBlockConveyorSorter'] ?? 0)

    const lcds = 0
        + (sbc.blocks["TextPanel/SmallTextPanel"] ?? 0)
        + (sbc.blocks["TextPanel/SmallLCDPanelWide"] ?? 0)
        + (sbc.blocks["TextPanel/SmallLCDPanel"] ?? 0)
        + (sbc.blocks["TextPanel/LargeBlockCorner_LCD_1"] ?? 0)
        + (sbc.blocks["TextPanel/LargeBlockCorner_LCD_2"] ?? 0)
        + (sbc.blocks["TextPanel/LargeBlockCorner_LCD_Flat_1"] ?? 0)
        + (sbc.blocks["TextPanel/LargeBlockCorner_LCD_Flat_2"] ?? 0)
        + (sbc.blocks["TextPanel/SmallBlockCorner_LCD_1"] ?? 0)
        + (sbc.blocks["TextPanel/SmallBlockCorner_LCD_2"] ?? 0)
        + (sbc.blocks["TextPanel/SmallBlockCorner_LCD_Flat_1"] ?? 0)
        + (sbc.blocks["TextPanel/SmallBlockCorner_LCD_Flat_2"] ?? 0)
        + (sbc.blocks["TextPanel/LargeTextPanel"] ?? 0)
        + (sbc.blocks["TextPanel/LargeLCDPanel"] ?? 0)
        + (sbc.blocks["TextPanel/LargeLCDPanelWide"] ?? 0)
        + (sbc.blocks["LCDPanelsBlock/LabEquipment"] ?? 0)
        + (sbc.blocks["LCDPanelsBlock/MedicalStation"] ?? 0)
        + (sbc.blocks["TextPanel/TransparentLCDLarge"] ?? 0)
        + (sbc.blocks["TextPanel/TransparentLCDSmall"] ?? 0)

    return (
        <MySection className={classes.root}>
            <MyBoxGroup height={2} width={6}>
                <MyBox width={2} flat>
                    <HeaderCell title='AUTOMATION' />
                </MyBox>
                <MyBox width={2}>
                    <ValueCell width={2} label={`prog.blocks`} value={progBlocks || '-'} />
                </MyBox>
                <MyBox width={2}>
                    <ValueCell label={`projectors`} value={projectors || '-'} />
                </MyBox>
                <MyBox width={3}>
                    <ValueCell label={`LCDs`} value={lcds || '-'} />
                    <ValueCell label={`buttons`} value={buttons || '-'} />
                    <ValueCell label={`soundBlocks`} value={soundBlocks || '-'} />
                </MyBox>
                <MyBox width={3}>
                    <ValueCell label={`sensors`} value={sensors || '-'} />
                    <ValueCell label={`timers`} value={timers || '-'} />
                    <ValueCell label={`sorters`} value={sorters || '-'} />
                </MyBox>
            </MyBoxGroup>
        </MySection>
    )
})) /* ============================================================================================================= */


type ProjectionCardSbc =
    | 'blocks'

interface IBpProjectionRow {
    sbc: {[key in keyof Pick<IBlueprint.ISbc, ProjectionCardSbc>]: IBlueprint.ISbc[key]},
}