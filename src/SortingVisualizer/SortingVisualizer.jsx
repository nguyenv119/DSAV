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
import { BubbleSortCode,
        SelectionSortCode,
        InsertionSortCode,
        MergeSortCode,
        HeapSortCode } from "../SortingAlgos/LearningArea/code";    

/*
? Importing the actual sorting algos */
import { bubbleSortExp } from "../SortingAlgos/Algorithms/bubbleSort"
import { selectionSortExp } from "../SortingAlgos/Algorithms/selectionSort"
import { insertionSortExp } from "../SortingAlgos/Algorithms/insertionSort"
import { mergeSortExp } from "../SortingAlgos/Algorithms/mergeSort"
import { heapSortExp } from "../SortingAlgos/Algorithms/heapSort"
import { randomIntFrom } from "../SortingAlgos/CommonMethods/commonMethods";
import 'bootstrap/dist/css/bootstrap.css';

/*
? Imports the Progress Bar */
import ProgressBar from './ProgressBar';
import { left } from "@popperjs/core";

const MINVAL = 10;
const MAXVAL = 625;
const SPEED_THRESHOLD = 5;

export const PRIMARY_COLOR = '#3a85ff8e';
export const SUPER_PRIMARY_COLOR = '#3A86FF';
export const SECONDARY_COLOR = '#FB5607';
export const GREEN_SPEED = 7;
export const SMALLER_COLOR = "#ea2c1e";
export const LARGER_COLOR = "#4BA14C"
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
            tArray: [],
            sortingAlgorithm: null,
            isSorting: false,
            buttonsDisabled: false,
            ANIMATION_SPEED_MS: 6, //6
            BARS: 14, // 14
            sortingInProgress: false,
            activeButton: "",
            activeSortingButton: "",
            comparisons: 0,
            isPaused: false,
            activeAlgorithm: 0,
            highlightedLine: [0],
            mergeSortActivated: false,
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
                    code: [ <BubbleSortCode highlightLines={[2]} /> ]
                },
                "selectionSort": {
                    about: [ selectionDescription() ],
                    code: [ <SelectionSortCode highlightLines={[2]} /> ]
                },
                "insertionSort": {
                    about: [ insertionDescription() ],
                    code: [ <InsertionSortCode highlightLines={[2]} /> ]
                },
                "mergeSort": {
                    about: [ mergeDescription() ],
                    code: [ <MergeSortCode highlightLines={[3]} /> ]
                },
                "heapSort": {
                    about: [ heapDescription() ],
                    code: [ <HeapSortCode highlightLines={[1]} /> ]
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
     * For all sorting algos, we are returned an animation array, and a copy
     * of the sorted array. At the end of every animation, we set the state
     * to be the sorted array, as to not redo the animations on the unsorted array
     * if it were not replaced with the sorted array */
    bubbleSort() {
        let [array, arrayBars] = this.makeProps();
        let comparisons = 0;
        console.log(this.state.array);
        bubbleSortExp(array, arrayBars, () => this.getSpeed(this.state.ANIMATION_SPEED_MS), comparisons, this.updateComparisons, () => this.getIsPaused(), this.updateHighlightedLine)
        .then((arr) => {
            this.setState({ array: arr, buttonsDisabled: false, isSorting: false, sortingInProgress: false });
            console.log(arr);
            console.log(this.state.array);
        })
    }

    selectionSort() {
        let [array, arrayBars] = this.makeProps();
        let comparisons = 0;
        selectionSortExp(array, arrayBars, () => this.getSpeed(this.state.ANIMATION_SPEED_MS), comparisons, this.updateComparisons, () => this.getIsPaused(), this.updateHighlightedLine)
        .then((arr) => {
            this.setState({ array: arr, buttonsDisabled: false, isSorting: false, sortingInProgress: false });
        })
    }

    insertionSort() {
        let [array, arrayBars] = this.makeProps();
        let comparisons = 0;

        insertionSortExp(array, arrayBars, () => this.getSpeed(this.state.ANIMATION_SPEED_MS), comparisons, this.updateComparisons, () => this.getIsPaused(), this.updateHighlightedLine)
        .then((arr) => {
            this.setState({ array: arr, buttonsDisabled: false, isSorting: false, sortingInProgress: false });
        })
    }

    mergeSort() {
        let [array, arrayBars] = this.makeProps();
        for (let i = 0; i < array.length; i++) {
            array[i] /= 2;
            arrayBars[i].style.height = `${array[i]}px`;
        }

        const arrayBarsUp = document.getElementsByClassName("arrayBarUp");
        let comparisons = 0;
        mergeSortExp(array, arrayBars, arrayBarsUp, () => this.getSpeed(this.state.ANIMATION_SPEED_MS), comparisons, this.updateComparisons, () => this.getIsPaused(), this.updateHighlightedLine)
        .then((arr) => {
            for (let i = 0; i < array.length; i++) {
                arr[i] *= 2;
                const height = parseInt(arrayBars[i].style.height, 10);
                arrayBars[i].style.height = `${height * 2}px`;
            }
            this.setState({ array: arr, buttonsDisabled: false, isSorting: false, sortingInProgress: false });
        })
    }

    heapSort() {
        let [array, arrayBars] = this.makeProps();
        let comparisons = 0;

        heapSortExp(array, arrayBars, () => this.getSpeed(this.state.ANIMATION_SPEED_MS), comparisons, this.updateComparisons, () => this.getIsPaused(), this.updateHighlightedLine)
        .then((arr) => {
            this.setState({ array: arr, buttonsDisabled: false, isSorting: false, sortingInProgress: false });
        })
    }

    /*
    ? Gets the speed of the animation */
    getSpeed(ANIMATION_SPEED_MS) {
        const speed = ANIMATION_SPEED_MS === 10 ?
            0 : ANIMATION_SPEED_MS === 8 ?
                10 : ANIMATION_SPEED_MS === 6 ?
                    20 : ANIMATION_SPEED_MS === 4 ?
                        200 : ANIMATION_SPEED_MS === 2 ?
                            1000 : ANIMATION_SPEED_MS === 0 ?
                                2000 : 3000;
        return speed;
    }

    /*
    ? Gets the width for each bar */
    getWidth() {
        const arrayBarsContainer = document.getElementsByClassName("arrayBars")[0];
        return arrayBarsContainer.clientWidth / this.determineBars();
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
            if (this.state.activeAlgorithm === 4) {
                array.push(randomIntFrom(MINVAL, MAXVAL / 2));
            } else array.push(randomIntFrom(MINVAL, MAXVAL));
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
                if (this.state.activeAlgorithm === 4) {
                    const arrayBarsUp = document.getElementsByClassName("arrayBarUp");
                    arrayBarsUp[i].style.width = `${5000 / length}px`;
                    arrayBarsUp[i].style.backgroundColor = PRIMARY_COLOR;
                }
            }
        });

        
    }

    /*
     ? Returns whether or not the animation is paused or not */
    getIsPaused() {
        return this.state.isPaused;
    }

    /* 
    ? Changes the state of the button that is being pressed down */
    buttonDown = (buttonName) => {
        this.setState({ activeButton: buttonName });
    };

    /* 
    ? Callback function to update comparisons. We have to pass in the function, 
    ? not just the variable comparisons, because it will create a local copy of comparisons
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


    /* Updated handleReset */
    handleReset = () => {
        // if (this.state.sortingInProgress) {
        //     this.handlePause();
        // }

        /* Reset styles */
        const arrayBars = document.getElementsByClassName("arrayBar");
        const array = this.state.array;
        console.log(array);
        console.log(arrayBars)
        for (let i = 0; i < arrayBars.length; i++) {
            console.log("hi");
            console.log(arrayBars[i].style.height);
            arrayBars[i].style.height = `${array[i]}px`;
            arrayBars[i].style.backgroundColor = PRIMARY_COLOR;
        }

        /* Generate new array */
        // console.log(this.state.tArray)
        
        /* Reset remaining state */
        // this.setState({
        //     array: this.state.tArray,
        //     comparisons: 0,
        //     sortingAlgorithm: null,
        //     isSorting: false,
        //     buttonsDisabled: false,
        //     sortingInProgress: false,
        //     isPaused: true
        // });
    }

    /*
        //Stops the Sorting
        stopSorting = () => {
            // Clear timeouts
            clearTimeout(this.state.sortingTimeout);

            // Reject any promises
            if (this.currentSortPromise) {
                this.currentSortPromise.cancel();
            }
                
            // Cleanup
            cancelAnimationFrame(this.animationFrame);
        }
    */
    

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
    ? Callbackfunction to update the highlightedLine we are on.
    ? Called in the animate function, and rerenders the code when we update */
    updateHighlightedLine = (newHighlightedLine) => {
        this.setState({ highlightedLine: newHighlightedLine });
    };

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
            const arrayBarsUp = document.getElementsByClassName("arrayBarUp");
            const barWidth = this.getWidth();            

            for (let i = 0; i < arrayBars.length; i++) {
                arrayBars[i].style.width = `${barWidth}px`;
                arrayBars[i].style.backgroundColor = PRIMARY_COLOR;

                /* This makes sure the width is always the same. No matter if we are in mergeSort or not, we do this. Doesnt hurt, since in others, we just dont see it */
                arrayBarsUp[i].style.width = `${barWidth}px`;
                arrayBarsUp[i].style.backgroundColor = PRIMARY_COLOR;
            }
        }
    )};
    
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
                comparisons,
                algorithmKeys,
                codeVisualizer,
                activeAlgorithm,
                highlightedLine
              } = this.state;

        /*
        ! Determine codeArea rendering */
        const activeAlgorithmKey = algorithmKeys[activeAlgorithm];
        const algorithm = codeVisualizer[activeAlgorithmKey];
        let algorithmCode;
        
        /*
        ? We only show the code highlighting if the speeds are not too high */
        if (ANIMATION_SPEED_MS <= SPEED_THRESHOLD) {
            switch (activeAlgorithmKey) {
                case "bubbleSort":
                    algorithmCode = <BubbleSortCode highlightLines={ isSorting ?  highlightedLine : [2] } />;
                    break;
                case "selectionSort":
                    algorithmCode = <SelectionSortCode highlightLines={ isSorting ?  highlightedLine : [2] } />;
                    break;
                case "insertionSort":
                    algorithmCode = <InsertionSortCode highlightLines={ isSorting ?  highlightedLine : [2] } />;
                    break;
                case "mergeSort":
                    algorithmCode = <MergeSortCode highlightLines={ isSorting ?  highlightedLine : [3] } />;
                    break;
                case "heapSort":
                    algorithmCode = <HeapSortCode highlightLines={ isSorting ?  highlightedLine : [1] } />;
                    break;
                default:
                    algorithmCode = "";
            }
        } else algorithmCode = algorithm.code;
    
        /* 
        !Code for determining what formula to use when calculating worse case */
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
                    <div className={`arrayBarsUp ${activeAlgorithmKey === "mergeSort" ? '' : ' hidden'}`}>
                        {array.map((value, index) => (
                            <div
                                className="arrayBarUp"
                                key={index}
                                style={{
                                    backgroundColor: PRIMARY_COLOR,
                                    height: "0px"
                                    // height: `${value}px`
                                }}
                            ></div>
                            ))}
                    </div>
                    <div 
                        className="arrayBars"
                        style={{height: activeAlgorithmKey === "mergeSort" ? '39.5%' : '79%'}}>
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
                                    <button className={`button _1`}
                                        onClick={() => {
                                            this.makeArray();
                                            /*
                                            ? Specifies the button that is active for 1. button animations, and 2. Code Visualization  */
                                            this.setState({ activeButton: "generateArray", activeSortingButton: "", activeAlgorithm: 0 });
                                        }}
                                        disabled={isSorting}>
                                            <span>Generate New Array</span><div class="back"></div>
                                    </button>
                                    <button className={`button _2`}
                                         onClick={() => {
                                             this.setState({ activeSortingButton: "bubbleSort", activeAlgorithm: 1 });
                                             this.bubbleSort()
                                        }}
                                        disabled={sortingInProgress}><span>Bubble Sort</span><div class="back"></div>
                                    </button>
                                    <button className={`button _3`}
                                        onClick={() => {
                                            this.setState({ activeSortingButton: "selectionSort", activeAlgorithm: 2 });
                                            this.selectionSort()
                                        }}
                                        disabled={sortingInProgress}><span>Selection Sort</span><div class="back"></div>
                                    </button>
                                    <button className={`button _4`}
                                        onClick={() => {
                                            this.setState({ activeSortingButton: "insertionSort", activeAlgorithm: 3 });
                                            this.insertionSort()
                                        }}
                                        disabled={sortingInProgress}><span>Insertion Sort</span><div class="back"></div>
                                    </button>
                                    <button className={`button _5`}
                                        onClick={() => {
                                            this.setState({ activeSortingButton: "mergeSort", activeAlgorithm: 4 });
                                            this.mergeSort()
                                        }
                                        } disabled={sortingInProgress}><span>Merge Sort</span><div class="back"></div>
                                    </button>
                                    <button className={`button _6`}
                                        onClick={() => {
                                            this.setState({ activeSortingButton: "heapSort", activeAlgorithm: 5 });
                                            this.heapSort()
                                        }}
                                        disabled={sortingInProgress}><span>Heap Sort</span><div class="back"></div>
                                    </button>
                                    
                                    {/* Reset Button */}
                                    {/* <button 
                                        className="button _1"
                                        onClick={this.handleReset}
                                    >
                                        Reset
                                    </button> */}
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
                            <div className="setting-item">
                                <button 
                                    className="button _none2"
                                    style={{ padding: "4% 12%", cursor: "auto"}}>
                                    Speed
                                </button>
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
                        
                        <div className="setting-item">
                            <button 
                                className="button _none2"
                                style={{ padding: "4% 12%", cursor: "auto"}}>
                                Array Length
                            </button>
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
                        <div className="btn-container">
                            <button className={`button _7${activeButton === "pause" ? ' down' : ''}`}
                                    onClick={() => {
                                        this.handlePause();
                                        this.setState({ activeButton: this.state.isPaused ? "" : "pause" });
                                    }}
                                    style={{width: '6vw',padding: "7% 2%"}}
                                    disabled={!this.state.sortingInProgress}>
                                <span>{this.state.isPaused ? "Play" : "Pause"}</span>
                                <div class="back"></div>
                            </button>
                        </div>
                        <div className="setting-item">
                            <button 
                                className="buttonSoon"
                                style={{ padding: "4% 40px", cursor: "auto"}}>
                                More Coming Soon...
                            </button>
                        </div>

                        </div>
                    </div>
                </div>
                <div className="codeArea">
                    {/* Determines the height of the description */}
                    <div 
                        className={`description${
                            activeAlgorithmKey === "none" ? ' intro' : 
                            activeAlgorithmKey === "insertionSort" ? ' insertion' :
                            activeAlgorithmKey === "mergeSort" ? ' merge' : 
                            activeAlgorithmKey === "heapSort" ? ' heap' : ' '}`}>
                        {algorithm.about}
                    </div>
                    <div 
                        className={`actualCode${
                            activeAlgorithmKey === "none" ? ' noCode' : 
                            activeAlgorithmKey === "insertionSort" ? ' insertion' :
                            activeAlgorithmKey === "mergeSort" ? ' merge' : 
                            activeAlgorithmKey === "heapSort" ? ' heap' : ' '}`}>
                        {algorithmCode}
                    </div>

                    {/* if we are at the start page, the explanation section is smaller */}
                    <div 
                        className={`explanation${
                            activeAlgorithmKey === "none" ? ' about-us' : 
                            (activeAlgorithmKey === "mergeSort") || (activeAlgorithmKey === "heapSort") ? ' merge' : ' '}`}>
                        <button className="button _none" style={{ fontSize: '0.9vw', height: '35px' }}>
                            <div className="comparison">
                                <span style={{ color: LARGER_COLOR }}>Current Case: {comparisons}</span>
                            </div>
                            <div className="separator"></div>
                            <div className="comparison">
                                <span style={{ color: SMALLER_COLOR }}>Worst Case: {totalComparisons}</span>
                            </div>
                        </button>

                        <h5 className={`${activeAlgorithmKey !== "none" ? 'hidden' : ''}`}><strong>Reach out and Contribute!</strong></h5>
                        <div class="wrapper noButtons">
                            {/* If we are in the sorting algorithms, we don't show the social media */}
                            <a className={`button img ${activeAlgorithmKey !== "none" ? 'hidden' : ''}`} href="https://github.com/nguyenv119/DSAV" target="_blank">
                                <img className="cta-image" src="DSAV/src/public/github-icon.png" alt="Github"></img>
                            </a>
                            <a className={`button img ${activeAlgorithmKey !== "none" ? 'hidden' : ''}`} href="mailto:nguyenv@brandeis.edu" target="_blank">
                                <img className="cta-image" src="DSAV/src/public/email-icon.png" alt="Email"></img>
                            </a>
                            <a className={`button img ${activeAlgorithmKey !== "none" ? 'hidden' : ''}`} href="https://www.linkedin.com/in/long-nguyen119/" target="_blank">
                                <img className="cta-image" src="DSAV/src/public/linkedin-icon.png" alt="Linkedin"></img>
                            </a>
                            <a className={`button img ${activeAlgorithmKey !== "none" ? 'hidden' : ''}`} href="https://www.instagram.com/_vinh.long_/" target="_blank">
                                <img className="cta-image" src="DSAV/src/public/instagram-icon.png" alt="Instagram"></img>
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