import React from "react";

/*
? Imports the descriptions and code for the algos */
import { 
         introDescription,
         bubbleDescription,
         selectionDescription,
         insertionDescription,
         mergeDescription,
         heapDescription } from "../SortingAlgos/LearningArea/descriptions";    
import { BubbleSortCode } from "../SortingAlgos/LearningArea/code";    

/*
? Importing the actual sorting algos */
import { bubbleSortExp } from "../SortingAlgos/Algorithms/bubbleSort"
import { selectionSortExp } from "../SortingAlgos/Algorithms/selectionSort"
import { insertionSortExp } from "../SortingAlgos/Algorithms/insertionSort"
import { mergeSortExp } from "../SortingAlgos/Algorithms/mergeSort"
import { heapSortExp } from "../SortingAlgos/Algorithms/heapSort"
import 'bootstrap/dist/css/bootstrap.css';

/*
? Imports the Progress Bar */
import ProgressBar from './ProgressBar';
import { left } from "@popperjs/core";

const MINVAL = 10;
const MAXVAL = 645;

export const PRIMARY_COLOR = '#3A86FF';
export const SECONDARY_COLOR = '#FB5607';
export const GREEN_SPEED = 7;
export const SMALLER_COLOR = "#ea2c1e";
export const LARGER_COLOR = "#50af50"
export const SAMESIZE_COLOR = "#f1cc32";
export const SMALLEST_SOFAR_COLOR = "#FF006E"
export const DONE_COLOR = "#FF006E";

/*
? export default class defines the class we want to have as a tag*/
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
            BARS: 14,
            sortingInProgress: false,
            activeButton: "",
            activeSortingButton: "",
            comparisons: 0,
            isPaused: false,
            activeAlgorithm: 1,
            algorithmKeys: ["none", "bubbleSort", "selectionSort", "insertionSort", "mergeSort", "heapSort"],

            /*
            ? This is the component that will be chosen dependant on the sorting algo */
            codeVisualizer: {
                "none": {
                    about: [ introDescription() ],
                    code: []
                },
                "bubbleSort": {
                    about: [ bubbleDescription() ],
                    code: [ <BubbleSortCode highlightLine={3} /> ]
                },
                "selectionSort": {
                    about: [ selectionDescription() ],
                    // code: [ selectionSortCode() ]
                },
                "insertionSort": {
                    about: [ insertionDescription() ],
                    // code: [ insertionSortCode() ]
                },
                "mergeSort": {
                    about: [ mergeDescription() ],
                    // code: [ mergeSortCode() ]
                },
                "heapSort": {
                    about: [ heapDescription() ],
                    // code: [ heapSortCode() ]
                },
            }
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
        const speed = ANIMATION_SPEED_MS === 10 ?
            1 : ANIMATION_SPEED_MS === 8 ?
                10 : ANIMATION_SPEED_MS === 6 ?
                    20 : ANIMATION_SPEED_MS === 4 ?
                        200 : ANIMATION_SPEED_MS === 2 ?
                            1000 : ANIMATION_SPEED_MS === 0 ?
                                2000 : 3000;
        return speed;
    }

    /* 
    ? Determines how many bars based on scrolling bar.
    ! We need to have the bars fill up all 1200 pixels. So our 1200/Bars should be a whole number*/
    determineBars() {
        const { BARS } = this.state;
        const length = BARS === 20 ?
            300 : BARS === 19 ?
                240 : BARS === 18 ?
                    200 : BARS === 17 ?
                        180 : BARS === 16 ?
                            150 : BARS === 15 ?
                                120 : BARS === 14 ?
                                    100 : BARS === 13 ?
                                        80 : BARS === 12 ?
                                            50 : BARS === 11 ?
                                                30 : BARS === 10 ?
                                                    25 : BARS === 9 ?
                                                        16 : BARS === 8 ?
                                                            12 : BARS === 7 ?
                                                                10 : BARS === 6 ?
                                                                    8 : BARS === 5
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
                /*
                TODO: To make the bars fill the screen, might have to change later */
                arrayBars[i].style.width = `${5000 / length}px`;
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
        bubbleSortExp(array, arrayBars, bubbleSortCode, () => this.getSpeed(this.state.ANIMATION_SPEED_MS), comparisons, this.updateComparisons, () => this.getIsPaused())
            .then((arr) => {
                this.setState({ array: arr, buttonsDisabled: false, isSorting: false, sortingInProgress: false });
            })
    }

    selectionSort() {
        let [array, arrayBars] = this.makeProps();
        let comparisons = 0;

        selectionSortExp(array, arrayBars, () => this.getSpeed(this.state.ANIMATION_SPEED_MS), comparisons, this.updateComparisons, () => this.getIsPaused()).then((arr) => {
            this.setState({ array: arr, buttonsDisabled: false, isSorting: false, sortingInProgress: false });
        })
    }

    insertionSort() {
        let [array, arrayBars] = this.makeProps();
        let comparisons = 0;

        insertionSortExp(array, arrayBars, () => this.getSpeed(this.state.ANIMATION_SPEED_MS), comparisons, this.updateComparisons, () => this.getIsPaused()).then((arr) => {
            this.setState({ array: arr, buttonsDisabled: false, isSorting: false, sortingInProgress: false });
        })
    }

    mergeSort() {
        let [array, arrayBars] = this.makeProps();
        let comparisons = 0;

        mergeSortExp(array, arrayBars, () => this.getSpeed(this.state.ANIMATION_SPEED_MS), comparisons, this.updateComparisons, () => this.getIsPaused()).then((arr) => {
            this.setState({ array: arr, buttonsDisabled: false, isSorting: false, sortingInProgress: false });
        })
    }

    heapSort() {
        let [array, arrayBars] = this.makeProps();
        let comparisons = 0;

        heapSortExp(array, arrayBars, () => this.getSpeed(this.state.ANIMATION_SPEED_MS), comparisons, this.updateComparisons, () => this.getIsPaused()).then((arr) => {
            this.setState({ array: arr, buttonsDisabled: false, isSorting: false, sortingInProgress: false });
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
        const { array,
            activeButton,
            activeSortingButton,
            sortingInProgress,
            isSorting,
            ANIMATION_SPEED_MS,
            BARS,
            comparisons } = this.state;

        const activeAlgorithmKey = this.state.algorithmKeys[this.state.activeAlgorithm];
        const algorithm = this.state.codeVisualizer[activeAlgorithmKey];
        
        //Code for determining what formula to use when calculating worse case
        let totalComparisons;
        
        switch (activeSortingButton) {
            case "bubbleSort":
            case "selectionSort":
            case "insertionSort":
                totalComparisons = Math.round((array.length * (array.length - 1)) / 2);
                break;
            case "mergeSort":
            case "heapSort":
                totalComparisons = Math.round(array.length * Math.log2(array.length));
                break;
            default:
                totalComparisons = 0;
        }

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
            <div>
                <div className="arrayContainer">
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
                    <ProgressBar comparisons={comparisons} totalComparisons={totalComparisons} />
                    <div class="buttons">
                        <div className="buttonContainer">
                            <div className="buttonGroup">
                                <div class="wrapper buttons">
                                    <button className={`cta sorting`}
                                        onClick={() => {
                                            this.makeArray();
                                            /*
                                            ? Specifies the button that is active for 1. button animations, and 2. Code Visualization  */
                                            this.setState({ activeButton: "generateArray", activeSortingButton: "", activeAlgorithm: 0 });
                                        }}
                                        disabled={isSorting}>Generate New Array
                                    </button>
                                    <button className={`cta sorting`}
                                         onClick={() => {
                                            this.bubbleSort()
                                            this.setState({ activeSortingButton: "bubbleSort", activeAlgorithm: 1 });
                                        }}
                                        disabled={sortingInProgress}>Bubble Sort
                                    </button>
                                    <button className={`cta sorting`}
                                        onClick={() => {
                                            this.selectionSort()
                                            this.setState({ activeSortingButton: "selectionSort", activeAlgorithm: 2 });
                                        }}
                                        disabled={sortingInProgress}>Selection Sort
                                    </button>
                                    <button className={`cta sorting`}
                                        onClick={() => {
                                            this.insertionSort()
                                            this.setState({ activeSortingButton: "insertionSort", activeAlgorithm: 3 });
                                        }}
                                        disabled={sortingInProgress}>Insertion Sort
                                    </button>
                                    <button className={`cta sorting`}
                                        onClick={() => {
                                            this.mergeSort()
                                            this.setState({ activeSortingButton: "mergeSort", activeAlgorithm: 4 });
                                        }
                                        } disabled={sortingInProgress}>Merge Sort
                                    </button>
                                    <button className={`cta sorting`}
                                        onClick={() => {
                                            this.heapSort()
                                            this.setState({ activeSortingButton: "heapSort", activeAlgorithm: 5 });
                                        }}
                                        disabled={sortingInProgress}>Heap Sort
                                    </button>
                                </div>
                                {/* <div className="btn-container">
                                    <button className={`btn-3d regular${activeSortingButton === "heapSort" ? ' down' : ''}`}
                                        onClick={() => {
                                            this.heapSort()
                                            this.setState({ activeSortingButton: "heapSort", activeAlgorithm: 5 });
                                        }}
                                        disabled={sortingInProgress}>Heap Sort</button>
                                </div> */}
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
                            <button className="btn-3d colorful regular speed">
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
                            <button
                                className="btn-3d regular comparisons"
                                style={{ fontSize: '16px', height: '60px', left: '-18px'}}
                            >
                                <span style={{ color: LARGER_COLOR }}>Current Case: {comparisons}</span>
                                <br />
                                <span style={{ color: SMALLER_COLOR  }}>Worse Case: {totalComparisons}</span>
                            </button>
                            <div className="btn-container">
                                <button className={`btn-3d regular pp${activeButton === "pause" ? ' down' : ''}`}
                                    onClick={() => {
                                        this.handlePause();
                                        this.setState({ activeButton: this.state.isPaused ? "" : "pause" });
                                    }}
                                    disabled={!this.state.sortingInProgress}>{this.state.isPaused ? "Play" : "Pause"}</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="codeArea">
                    {/* Determines the height of the description */}
                    <div 
                        className={`description${
                            activeAlgorithmKey === "none" ? ' intro' : 
                            activeAlgorithmKey === "mergeSort" ? ' merge' : 
                            activeAlgorithmKey === "heapSort" ? ' heap' : ' '}`}>
                        {algorithm.about}
                    </div>
                    <div 
                        className={`actualCode${
                            activeAlgorithmKey === "none" ? ' noCode' : 
                            (activeAlgorithmKey === "mergeSort") || (activeAlgorithmKey === "heapSort") ? ' merge' : ' '}`}>
                        {algorithm.code}
                    </div>

                    {/* if we are at the start page, the explanation section is smaller */}
                    <div 
                        className={`explanation${
                            activeAlgorithmKey === "none" ? ' about-us' : 
                            (activeAlgorithmKey === "mergeSort") || (activeAlgorithmKey === "heapSort") ? ' merge' : ' '}`}>

                        <h5 className={`${activeAlgorithmKey !== "none" ? 'hidden' : ''}`}><strong>Reach out and Contribute!</strong></h5>
                        <div class="wrapper noButtons">
                            {/* If we are in the sorting algorithms, we don't show the social media */}
                            <a className={`cta img ${activeAlgorithmKey !== "none" ? 'hidden' : ''}`} href="https://github.com/nguyenv119/DSAV" target="_blank">
                                <img className="cta-image" src="/github-icon.png" alt="Github"></img>
                            </a>
                            <a className={`cta img ${activeAlgorithmKey !== "none" ? 'hidden' : ''}`} href="mailto:nguyenv@brandeis.edu" target="_blank">
                                <img className="cta-image" src="/email-icon.png" alt="Email"></img>
                            </a>
                            <a className={`cta img ${activeAlgorithmKey !== "none" ? 'hidden' : ''}`} href="https://www.linkedin.com/in/long-nguyen-8b77b7248/" target="_blank">
                                <img className="cta-image" src="/linkedin-icon.png" alt="Linkedin"></img>
                            </a>
                            <a className={`cta img ${activeAlgorithmKey !== "none" ? 'hidden' : ''}`} href="https://www.instagram.com/_vinh.long_/" target="_blank">
                                <img className="cta-image" src="/instagram-icon.png" alt="Instagram"></img>
                            </a>
                        </div>
                    </div>
                </div>
                <div>
                    <footer className="footerStyle">
                        <p> DSAV Copyright @2023 </p>
                    </footer>
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