'use strict';

//const e = React.createElement;

class Catalog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selected: null };

        this.listItems = props.items.map((line) =>
            <li key={line.key}>
            <a href="#"  onClick={this.handleClick.bind(this,line.key)}>{line.text}</a>
            </li>)

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(key,e) {
		if (window.animationTimer) clearTimeout(window.animationTimer);  // stop all animation

        this.props.items[key].action( key, this.props.data);
        this.setState(state => ({
            selected: key
        }));
    }

    render() {
        // if (this.state.selected) {
        //     return 'OK!';
        // }

        return (
                <ul>{this.listItems}</ul>
        );  
    }
}

function load_chart_catalog(chartlist,data) {
    const domContainer = document.querySelector('#catalog_container');
    ReactDOM.render(<Catalog items={chartlist} data={data} />, domContainer);
}
