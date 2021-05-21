import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

import { DateRangePicker } from 'react-date-range';

import { addDays } from 'date-fns';
import { useState } from 'react';

const [state, setState] = useState([
  {
    startDate: new Date(),
    endDate: addDays(new Date(), 7),
    key: 'selection'
  }
]);

ReactDOM.render(

    <DateRangePicker
        onChange={item => setState([item.selection])}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={state}
        direction="horizontal"
    />,
    document.querySelector('#daterange_container')
);
