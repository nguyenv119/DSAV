import React from "react";
import { mergeSortExp } from "../SortingAlgos/mergeSort"
import { bubbleSortExp } from "../SortingAlgos/bubbleSort"
import { selectionSortExp } from "../SortingAlgos/selectionSort"
import { insertionSortExp } from "../SortingAlgos/insertionSort"
import { heapSortExp } from "../SortingAlgos/heapSort"
import 'bootstrap/dist/css/bootstrap.css';
import ProgressBar from './ProgressBar';

const MINVAL = 5;
const MAXVAL = 625;
export const GREEN_SPEED = 7;
export const SMALLER_COLOR = "#f44336";
export const LARGER_COLOR = "#50af50"
export const SAMESIZE_COLOR = "#f1cc32";
export const SMALLEST_SOFAR_COLOR = "#FF006E"
export const DONE_COLOR = "#FF006E";

export const PRIMARY_COLOR = '#3A86FF';
export const SECONDARY_COLOR = '#FB5607';

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
            activeAlgorithm: 0,
            algorithmKeys: ["none", "bubbleSort", "selectionSort", "insertionSort", "mergeSort", "heapSort"],

            /*
            ? This is the component that will be chosen dependant on the sorting algo */
            codeVisualizer: {
                "none": {
                    about: [
                        <h6><strong>Data Structure & Algorithm Visualizer</strong></h6>,
                        <br />,
                        <p> This is DSAV. We're all about helping you learn
                            a little easier. We've got
                            you covered with cool animations to visualize what actually
                            going on behind the algorithms you learn.

                            <br /><br />Learn at your own pace with the tools below. Play, pause,
                            change the speed, length...etc

                            <br /><br />We've got plans to add more data
                            structures for you to visualize:
                        </p>,
                        <li> Arrays, Stacks, Queues, Linked Lists</li>,
                        <li> Trees, Heaps, Graphs </li>, <br />,
                        <p> So, stay updated, and we'll keep you covered!</p>
                    ],
                    code: [
                        <div className="about-us">
                        </div>
                    ]
                },
                "bubbleSort": {
                    /*
                    ? Renders an array of JSX components */
                    about: [
                        <p>
                            <h6><strong>Bubble Sort:</strong></h6>
                            A straightforward sorting algorithm that <br />
                            repeatedly compares adjacent elements in a list <br />
                            and swaps them if they are in the wrong order. <br />
                            This process continues until the list is sorted.<br /><br />
                            <h6><strong>Time Complexity:</strong></h6>
                        </p>,
                        <ul>
                            <li> Best Case: Ω(n) — the list is already sorted, <br />
                                so no swaps are needed. The list <br />
                                is traversed n times, where we have n <br />
                                elements.
                            </li>
                            <li> Average Case: O(n<sup>2</sup>) — the algorithm <br />
                                makes n<sup>2</sup>/2 comparisons.
                            </li>
                            <li> Worst Case: O(n<sup>2</sup>) — the list is in <br />
                                reverse order, requiring the n iterations <br />
                                and (n - 1), (n - 2)... 1 comparisons & swaps.
                            </li>
                        </ul>,
                        <h6><strong>Space Complexity:</strong></h6>,
                        <p>O(1) — Bubble Sort sorts the list in place without requiring additional memory.</p>
                    ],
                    code: [
<pre style={{ fontSize: "12px" }}>
    <code>
{`Bubble-Sort(A, n) {
    didSwap ← true
    while (didSwap) {
        didSwap ← false
        for i ← 0 to n - 2 {
            if (A[i] > A[i + 1]) {
                swap(A[i], A[i + 1]);
                didSwap ← true
            }
        }
    }
}
`}
    </code>
</pre>
                    ]

                },
                "selectionSort": {
                    about: [
                        <p>
                            <h6><strong>Selection Sort:</strong></h6>
                            An easy-top-implement sorting algorithm that 
                            repeatedly finds the smallest element 
                            from the unsorted part of the list and swaps it 
                            with the first unsorted element. <br />
                        </p>,
                        <h6><strong>Time Complexity:</strong></h6>,
                        <ul>
                            <li> All Cases: θ(n<sup>2</sup>)</li>
                            <li>
                                In every possible iteration, unsorted or
                                sorted, the the algorithm makes n(n-1)/2 
                                comparisons, which simplifies to O(n<sup>2</sup>).
                            </li>
                            <li>
                                This is because in any case, we have no knowledge of where the next minimum is
                            </li>
                        </ul>,
                        <h6><strong>Space Complexity:</strong></h6>,
                        <p>O(1) — Selection Sort sorts the list in place
                            without requiring additional memory.</p>
                    ],
                    code: [
<pre style={{ fontSize: "12px" }}>
    <code>
{`Selection-Sort(A, n) 
    for i ← 0 to n - 2
          k ← i
          for j ← (i + 1) to n - 1 
              if (A[j] < A[k]) then
                  k ← j
          if (k != j) then
              swap(A[i], A[k])
`}
    </code>
</pre>],
                },
                "insertionSort": {
                    about: [
                        <p>
                            <h6><strong>Insertion Sort:</strong></h6>
                            We build a sorted list one element at a time. <br />
                            Each iteration removes one element from <br />
                            the input data, finds the location it belongs <br />
                            within the sorted list, and inserts it there. <br /><br />
                            <h6><strong>Time Complexity:</strong></h6>
                        </p>,
                        <ul>
                            <li> Best Case: Ω(n) — when the list is sorted,<br />
                                the algorithm only passes through the list <br />
                                once, n times for n elements.
                            </li>
                            <li> Average-case: θ(n<sup>2</sup>) — On average, the algorithm makes quadratic number of comparisons.
                            </li>
                            <li> Worst-case: θ(n<sup>2</sup>) — In the worst-case <br />
                                scenario (when the list is in reverse order), <br /> the
                                algorithm makes a quadratic <br />
                                number of comparisons.
                            </li>
                        </ul>,
                        <h6><strong>Space Complexity:</strong></h6>,
                        <p>O(1) — Insertion Sort sorts the list in place without requiring additional memory.</p>
                    ],
                    code: "",
                },
                "mergeSort": {
                    about: [
                        <p>
                            <h6><strong>Merge Sort:</strong></h6>
                            is a divide and conquer algorithm that divides the <br />
                            input array into two halves, sorts them and then merges the two sorted halves. <br /><br />
                            <h6><strong>Time Complexity:</strong></h6>
                        </p>,
                        <ul>
                            <li> All Cases: Ω(nlog(n))</li>
                            <li>
                                In every possible scenario, when the list is sorted,
                                or when it is not, the list always <br />
                                performs a linearaithmic number of <br />
                                operations
                            </li>
                        </ul>,
                        <h6><strong>Space Complexity:</strong></h6>,
                        <p>O(n) — Merge Sort is not an in-place algorithm <br />
                            and requires extra space: our auxiliary array is of
                            <br /> n elements.</p>
                    ],
                    code: "",
                },
                "heapSort": {
                    about: [
                        <p>
                            <h6><strong>Heap Sort:</strong></h6>
                            A sorting algorithm based on a <br />
                            Max Binary-Heap. We build a max heap, and, <br />
                            swapping the root element with the end element, <br />
                            reduce the heap size by one. <br /><br />
                            <h6><strong>Time Complexity:</strong></h6>
                        </p>,
                        <ul>
                            <li> All Cases: θ(n log n)</li>
                            <li> In all scenarios, making a max-heap is θ(n). <br />
                                The subsequent steps swap the end and <br />
                                root for n elements, and HEAPIFY-DOWN <br />
                                for those n elements.
                            </li>
                        </ul>,
                        <h6><strong>Space Complexity:</strong></h6>,
                        <p>O(1) — Heap Sort is an in-place sorting algorithm <br />
                            since the MAX-HEAP is used from our original <br />
                            array.</p>
                    ],
                    code: "",
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
                arrayBars[i].style.width = `${1200 / length}px`;
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
        bubbleSortExp(array, arrayBars, () => this.getSpeed(this.state.ANIMATION_SPEED_MS), comparisons, this.updateComparisons, () => this.getIsPaused())
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
                <ProgressBar comparisons={comparisons} totalComparisons={totalComparisons} />
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
                    <div class="buttons">
                        <div className="buttonContainer">
                            <div className="buttonGroup">
                                <div class="wrapper">
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
                            <button className="btn-3d regular comparisons">
                                Comparisions: {comparisons}
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
                    <div className={`description${activeAlgorithmKey === "none" ? ' intro' : ''}`}>
                        {algorithm.about}
                    </div>
                    <div className={`actualCode${activeAlgorithmKey === "none" ? ' noCode' : ''}`}>
                        {algorithm.code}
                    </div>

                    {/* if we are at the start page, the explanation section is smaller */}
                    <div className={`explanation${activeAlgorithmKey === "none" ? ' about-us' : ''}`}>
                        <h6><strong>Reach out and Contribute!</strong></h6>
                        <div class="wrapper">
                            <a class="cta img" href="https://github.com/nguyenv119/DSAV" target="_blank">
                                <img class="cta-image" src="/github-icon.png" alt="Github"></img>
                            </a>
                            <a class="cta img" href="mailto:nguyenv@brandeis.edu" target="_blank">
                                <img class="cta-image" src="/email-icon.png" alt="Email"></img>
                            </a>
                            <a class="cta img" href="https://www.linkedin.com/in/long-nguyen-8b77b7248/" target="_blank">
                                <img class="cta-image" src="/linkedin-icon.png" alt="Linkedin"></img>
                            </a>
                            <a class="cta img" href="https://www.instagram.com/_vinh.long_/" target="_blank">
                                <img class="cta-image" src="/instagram-icon.png" alt="Instagram"></img>
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
