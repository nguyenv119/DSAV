



                                    /*
                                    ! Add a super fast sorting option so we can have that option, not to wait for so damn long: in there, we just run the regular animate
                                    TODO: Do heap-sorting speed

                                    TODO: MergeSort
                                    ? We can try make merge-sort more compelling by changing the margins of the size of the auxiliary array 
                                    ? Make it more visually compelling by pinking the completion of the merging of aux arrays

                                    CHECKING
                                    */


import React from "react";
import {mergeSortExp} from "../SortingAlgos/mergeSort"
import {bubbleSortExp} from "../SortingAlgos/bubbleSort"
import {selectionSortExp} from "../SortingAlgos/selectionSort"
import {insertionSortExp} from "../SortingAlgos/insertionSort"
import {heapSortExp} from "../SortingAlgos/heapSort"
import 'bootstrap/dist/css/bootstrap.css';

const MINVAL = 5;
const MAXVAL = 625;
export const GREEN_SPEED = 7;
export const PRIMARY_COLOR = '#007ce8';
export const SECONDARY_COLOR = '#fe5f24';
export const SMALLER_COLOR = "#f44336";
export const LARGER_COLOR = "#50af50"
export const SAMESIZE_COLOR = "#f1cc32";
export const SMALLEST_SOFAR_COLOR = "#FC0FC0"
export const DONE_COLOR = "rgba(255, 0, 166, 0.87)";

/* export default class defines the class we want to have as a tag*/
export default class SortingVisualizer extends React.Component {

    /* 
    ? Called when react component is created 
     * props = properties, passed down from parent comp 
     * (component where this component is called):
    */
    constructor(props) {
        /* 
        ? Gets data */
        super(props);

        /* 
        ? Init the initial state of component */
        this.state = {
            array: [],
            sortingAlgorithm: null,
            isSorting: false,
            buttonsDisabled: false,
            ANIMATION_SPEED_MS: 6, 
            BARS: 10, 
            sortingInProgress: false, 
            activeButton: null,
            comparisons: 0,
            isPaused: false
        };
    };

    /* 
    ? Lifecycle method in React class component 
     * invoked immedientally after a component is 
     * mounted (inserted into DOM tree), rendered for the first time
     */
    componentDidMount() { 
        this.makeArray()
    }

    /* 
    ? Create properties before sorting: arrayBars, array, and speed*/
    makeProps() {
        this.setState({ buttonsDisabled: true, isSorting: true, sortingInProgress: true });
        const arrayBars = document.getElementsByClassName("arrayBar");
        const { array } = this.state;
        return [array, arrayBars];
    }

    /*
    ? Gets the speed of the animation */
    getSpeed(ANIMATION_SPEED_MS) {
        const speed = ANIMATION_SPEED_MS === 10?
        1 : ANIMATION_SPEED_MS === 8 ?
            10 : ANIMATION_SPEED_MS === 6 ?
                20 : ANIMATION_SPEED_MS === 4 ?
                    200 : ANIMATION_SPEED_MS === 2 ?
                        1000 : ANIMATION_SPEED_MS === 0 ?
                            2000 : 3000;
        return speed;
    }

    /* 
    ? Determines how many bars based on scrolling bar */
    determineBars() {
        const { BARS } = this.state;
        const length = BARS === 20 ? 
            300 : BARS === 19 ? 
                290 : BARS === 18 ? 
                    260 : BARS === 17 ? 
                        230 : BARS === 16 ? 
                            200 : BARS === 15 ? 
                                180 : BARS === 14 ? 
                                    160 : BARS === 13 ? 
                                        145 : BARS === 12 ? 
                                            120 : BARS === 11 ? 
                                                100 : BARS === 10 ? 
                                                    80 : BARS === 9 ? 
                                                        60 : BARS === 8 ? 
                                                            40 : BARS === 7 ? 
                                                                20 : BARS === 6 ? 
                                                                    10 : BARS === 5  
                                                                        ? 5 : 5;
        return length;
    }
 
    /* 
    ? Create the array, including how many bars and how wide */
    makeArray() {
        
        const array = [];
        let length = this.determineBars();

        for (let i = 0; i < length; i++) {
            array.push(randomIntFrom(MINVAL, MAXVAL));
        }

        /* 
        ? Sets the state to be the created array and the Bars.
         * If we didnt have setState, we wouldnt
         * update the array we created
         */
        this.setState({ comparisons: 0, array }, () => {
            /* 
            ? Resets the color of array back to PRIMARY, and determines width and length */            
            const arrayBars = document.getElementsByClassName("arrayBar");
            for (let i = 0; i < arrayBars.length; i++) {
                arrayBars[i].style.width = `${810 / length}px`;
                arrayBars[i].style.backgroundColor = PRIMARY_COLOR;
            }
        });
    }

    /*
     ? Returns whether or not the animation is paused or not */
    getIsPaused() {
        return this.state.isPaused;
    }

    /* 
     * For all sorting algos, we are returned an animation array, and a copy
     * of the sorted array. At the end of every animation, we set the state
     * to be the sorted array, as to not redo the animations on the unsorted array
     * if it were not replaced with the sorted array */ 
    bubbleSort() {
        let [array, arrayBars] = this.makeProps();
        let comparisons = 0;
        bubbleSortExp(array, arrayBars, () => this.getSpeed(this.state.ANIMATION_SPEED_MS), comparisons, this.updateComparisons, () => this.getIsPaused()).then((arr) => {
            this.setState({ array: arr, buttonsDisabled: false, isSorting: false, sortingInProgress: false});
        })
    }

    selectionSort() {
        let [array, arrayBars] = this.makeProps();
        let comparisons = 0;

        selectionSortExp(array, arrayBars, () => this.getSpeed(this.state.ANIMATION_SPEED_MS), comparisons, this.updateComparisons).then((arr) => {
            this.setState({ array: arr, buttonsDisabled: false, isSorting: false, sortingInProgress: false});
        })
    }

    insertionSort() {
        let [array, arrayBars] = this.makeProps();
        let comparisons = 0;

        insertionSortExp(array, arrayBars, () => this.getSpeed(this.state.ANIMATION_SPEED_MS), comparisons, this.updateComparisons).then((arr) => {
            this.setState({ array: arr, buttonsDisabled: false, isSorting: false, sortingInProgress: false});
        })
    }
    
    mergeSort() {
        let [array, arrayBars] = this.makeProps();
        let comparisons = 0;

        mergeSortExp(array, arrayBars, () => this.getSpeed(this.state.ANIMATION_SPEED_MS), comparisons, this.updateComparisons).then((arr) => {
            this.setState({ array: arr, buttonsDisabled: false, isSorting: false, sortingInProgress: false});
        })
    }

    heapSort() {
        let [array, arrayBars] = this.makeProps();
        let comparisons = 0;

        heapSortExp(array, arrayBars, () => this.getSpeed(this.state.ANIMATION_SPEED_MS), comparisons, this.updateComparisons).then((arr) => {
            this.setState({ array: arr, buttonsDisabled: false, isSorting: false, sortingInProgress: false});
        })
    }
    
    /* 
    ? Updates the number of bars and their width */  
    handleBarsChange = (e) => {
        if (!this.state.isSorting) {
            this.setState({ BARS: parseInt(e.target.value) }, () => {
                this.makeArray();
            });
        }
    };

    /* 
    ? Changes the speed of animation */
    handleAnimationSpeedChange = (e) => {
        this.setState({ ANIMATION_SPEED_MS: parseInt(e.target.value) });
    };
    
    /* 
    ? Changes the state of the button that is being pressed down */
    buttonDown = (buttonName) => {
        this.setState({ activeButton: buttonName });
    };

    /* 
    ? Callback function to update comparisons. We have to pass in the function, 
    ? not just the varibale comparisons, because it will create a local copy of comparisons
    ? in the sorting JS file */
    updateComparisons = (newComparisons) => {
        this.setState({ comparisons: newComparisons });
    };

    /*
    ? Handles the pause/play action*/
    handlePause = () => {
        this.setState(prevState => ({
            isPaused: !prevState.isPaused
        }));
    }
    
    /* 
    ? Renders components UI */
    render() {
        /* 
        ? Gets the state (array we created) out of the object, 
         * We need the {}, won't work with just array
        */
        const { array, activeButton, isSorting, ANIMATION_SPEED_MS, BARS, comparisons } = this.state;
        return (
            /* 
            ? Map = go through each num in array, extracting value and index and making it into a bar:
             * 
             * Can put any variable name because when we call array.map, 
             * 2 parameters are returned: value and index, so the callback function
             * knows to associate.
             * 
             * ref: https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_map3
            */

            <div className="arrayContainer">
                <div>
                    <div className="buttonContainer">
                        <div className="buttonGroup">
                            <div className="btn-container">
                                <button className = {`btn-3d regular${activeButton === "generateArray" ? ' down' : ''}`} 
                                onClick={() => {
                                    this.makeArray();
                                    this.buttonDown("generateArray");
                                }} 
                                disabled={isSorting}>Generate New Array</button>
                            </div>
                            <div className="btn-container">
                                <button className = {`btn-3d regular${activeButton === "bubbleSort" ? ' down' : ''}`} 
                                onClick={() => {
                                    this.bubbleSort()
                                    this.buttonDown("bubbleSort");
                                }} 
                                disabled={this.state.sortingInProgress}>Bubble Sort</button>
                            </div>
                            <div className="btn-container">
                                <button className = {`btn-3d regular${activeButton === "selectionSort" ? ' down' : ''}`} 
                                onClick={() => {
                                    this.selectionSort()
                                    this.buttonDown("selectionSort");
                                }}
                                disabled={this.state.sortingInProgress}>Selection Sort</button>
                            </div>
                            <div className="btn-container">
                                <button className = {`btn-3d regular${activeButton === "insertionSort" ? ' down' : ''}`} 
                                onClick={() => {
                                    this.insertionSort()
                                    this.buttonDown("insertionSort");
                                }} 
                                disabled={this.state.sortingInProgress}>Insertion Sort</button>
                            </div>
                            <div className="btn-container">
                                <button className = {`btn-3d regular${activeButton === "mergeSort" ? ' down' : ''}`} 
                                onClick={() => {
                                    this.mergeSort()
                                    this.buttonDown("mergeSort");
                                }
                                } disabled={this.state.sortingInProgress}>Merge Sort</button>
                            </div>
                            <div className="btn-container">
                                <button className = {`btn-3d regular${activeButton === "heapSort" ? ' down' : ''}`} 
                                onClick={() => {
                                    this.heapSort()
                                    this.buttonDown("heapSort");
                                }} 
                                disabled={this.state.sortingInProgress}>Heap Sort</button>
                            </div>
                        </div>
                    </div>
                    <div className="settings">
                        <div className="scrollableRangeContainer">
                            <label for="customRange3" className="form-label"></label>
                            <div className="scrollableRange">
                                <input
                                    type="range"
                                    className="form-range"
                                    min="0"
                                    max="10"
                                    step="2"
                                    id="customRange3"
                                    value={ANIMATION_SPEED_MS}
                                    onChange={this.handleAnimationSpeedChange}
                                ></input>
                            </div>
                        </div>
                        <button className="btn-3d regular colorful speed">
                            Speed
                        </button>
                        <div className="scrollableRangeContainer">
                            <label for="customRange4" className="form-label"></label>
                            <div className="scrollableRange">
                                <input
                                    type="range"
                                    className="form-range"
                                    min="5"
                                    max="20"
                                    step="1"
                                    id="customRange4"
                                    value={BARS}
                                    onChange={this.handleBarsChange}
                                ></input>
                            </div>
                        </div>
                        <button className="btn-3d colorful regular length">
                            Array Length
                        </button>
                        <button className="btn-3d regular comparisons"> 
                        Comparisions: {comparisons}                                
                        </button>
                        <div className="btn-container">
                            <button className = {`btn-3d regular${activeButton === "pause" ? ' down' : ''}`} 
                            onClick={() => {
                                this.handlePause()
                                this.buttonDown("pause");
                            }} 
                            disabled={!this.state.sortingInProgress}>Pause/Continue</button>
                        </div>

                    </div>
                </div>
                <div className="arrayBars">
                    {array.map((value, index) => (
                    <div
                        className="arrayBar"
                        key={index}
                        style={{
                        backgroundColor: PRIMARY_COLOR,
                        height: `${value}px`
                        }}
                    ></div>
                    ))}
                </div>
            </div>
        );
    }
}

/* 
? Generates random int from min to max */
function randomIntFrom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}