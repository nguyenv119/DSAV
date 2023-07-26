import '../../../src/App.css';
export const introDescription = () => (
    <>
        <h5><strong>Data Structure & Algorithm Visualizer</strong></h5>
        <br />
        <p> This is DSAV. We're all about helping you learn
            a little easier. We've got
            you covered with cool animations to visualize what actually
            going on behind the algorithms you learn.

            <br /><br />Learn at your own pace with the tools below. Play, pause,
            change the speed, length...etc

            <br /><br />We've got plans to add more data
            structures for you to visualize:
        </p>
        <li> Arrays, Stacks, Queues, Linked Lists</li>
        <li> Trees, Heaps, Graphs </li> <br />
        <p> So, stay updated, and we'll keep you covered!</p>
    </>
);

export const bubbleDescription = () => (
    <>
        <p>
            <h5><strong>Bubble Sort:</strong></h5>
            A straightforward sorting algorithm that 
            repeatedly compares adjacent elements in a list 
            and swaps them if they are in the wrong order. 
            This process continues until the list is sorted.<br /><br />
            <h6><strong>Time Complexity:</strong></h6>
        </p>
        <ul>
            <li> Best Case: Ω(n) — a sorted list,
                so no swaps are needed. The list
                is traversed n times, for n
                elements.
            </li>
            <li> Average Case: O(n<sup>2</sup>) — the algorithm
                makes n<sup>2</sup>/2 comparisons.
            </li>
            <li> Worst Case: O(n<sup>2</sup>) — the list is
                reversely-sorted, requiring the n iterations
                and (n - 1), (n - 2)...1 comparisons & swaps.
            </li>
        </ul>
        <h6><strong>Space Complexity:</strong></h6>
        <p>θ(1) — Sorts the list in-place without requiring additional storage.</p>
    </>
);

export const selectionDescription = () => (
    <>
        <p>
            <h5><strong>Selection Sort:</strong></h5>
            This simple algorithm repeatedly <i>selects</i> the smallest element from the unsorted segment of the list, 
            and then swaps it with the first unsorted item. <br />
        </p>
        <h6><strong>Time Complexity:</strong></h6>
        <ul>
            <li> All Cases: θ(n<sup>2</sup>)</li>
            <li>
                Whether the list is sorted or not, 
                the algorithm always makes n(n-1)/2 comparisons: O(n<sup>2</sup>).
            </li>
            <li>
                This is the case since without any additional knowledge, 
                it cannot determine where the next minimum value will be in the unsorted part of the list.
            </li>
        </ul>
        <h6><strong>Space Complexity:</strong></h6>
        <p>θ(1) — Sorts the list in-place without requiring additional storage.</p>
    </>
);

export const insertionDescription = () => (
    <>
        <p>
            <h5><strong>Insertion Sort:</strong></h5>
            Each iteration removes one element from
            the unsorted array, finds the location it belongs
            within the sorted part, and inserts it there. <br /><br />
            <h6><strong>Time Complexity:</strong></h6>
        </p>
        <ul>
            <li> Best Case: Ω(n) — a sorted list:
                the algorithm only passes through the list 
                once, n times for n elements.
            </li>
            <li> Average-case: θ(n<sup>2</sup>) — the algorithm makes quadratic number of comparisons.
            </li>
            <li> Worst-case: θ(n<sup>2</sup>) — The list is in reverse order, the
                algorithm makes a quadratic
                number of comparisons.
            </li>
        </ul>
        <h6><strong>Space Complexity:</strong></h6>
        <p>θ(1) — Sorts the list in-place without requiring additional storage.</p>
    </>
);

export const mergeDescription = () => (
    <>
        <p>
            <h5><strong>Merge Sort:</strong></h5>
            is a divide and conquer algorithm that divides the
            input array into two halves, sorts them and then merges the two sorted halves. <br /><br />
            <h6><strong>Time Complexity:</strong></h6>
        </p>
        <ul>
            <li> All Cases: Ω(nlog(n))</li>
            <li>
                In every possible scenario, when the list is sorted,
                or when it is not, the list always
                performs a linearaithmic number of
                operations
            </li>
        </ul>
        <h6><strong>Space Complexity:</strong></h6>
        <p>O(n) — Merge Sort is not an in-place algorithm
            and requires extra space: our auxiliary array is of
            n elements.</p>
    </>
);

export const heapDescription = () => (
    <>
        <p>
            <h5><strong>Heap Sort:</strong></h5>
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
    </>
);