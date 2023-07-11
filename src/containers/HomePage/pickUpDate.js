import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function DateTimePickerValue() {
    const [value, setValue] = React.useState(dayjs(new Date()));
    console.log(Date.parse(value))
    const change = () => {
        alert("click")
    }
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                <DateTimePicker
                    label="Controlled picker"
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                    // views={['day', 'month', 'year']}
                    onClick={() => { this.change() }}
                />
            </DemoContainer>
        </LocalizationProvider>
    );
}
