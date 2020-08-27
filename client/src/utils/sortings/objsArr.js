export const sortObjsArrByProperty = (
  arr,
  objProperty,
  sortOrder = 'ascending'
) => {
  if (sortOrder === 'ascending') {
    arr.sort((a, b) => (a.objProperty < b.objProperty ? -1 : 1));
  } else if (sortOrder === 'descending') {
    // If preveous item smaller then next item, we switch between them
    // (reversed sorting)
    arr.sort((a, b) => (a.objProperty < b.objProperty ? 1 : -1));
    //arr.sort((a, b) => (a.objProperty < b.objProperty || !b.objProperty? 1 : -1));

    // arr.sort((a, b) => {
    //   return a.objProperty < b.objProperty ? 1 : -1;
    // });

    // arr.sort((a, b) => {
    //   if (a.objProperty < b.objProperty) return 1;
    //   else return -1;
    // });
  }
};

// const swap2Items = (item1, item2) => {
//   const temp = item1;
//   item1 = item2;
//   item2 = temp;
// };

// Descending order
export const sortByDates = (arr) => {
  for (let j = arr.length - 1; j > 0; j--) {
    for (let i = 0; i < j; i++) {
      if (!arr[i].to && !arr[i + 1].to) {
        if (arr[i].from < arr[i + 1].from) {
          //swap2Items(arr[i], arr[i + 1]);
          const temp = arr[i];
          arr[i] = arr[i + 1];
          arr[i + 1] = temp;
        }
      } else if (arr[i].to && arr[i + 1].to) {
        if (arr[i].to < arr[i + 1].to) {
          //swap2Items(arr[i], arr[i + 1]);
          const temp = arr[i];
          arr[i] = arr[i + 1];
          arr[i + 1] = temp;
        }
      } else if (!arr[i + 1].to) {
        //swap2Items(arr[i], arr[i + 1]);
        const temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
      }
    }
  }
};

// function bubbleSortConcept2(arr) {
//   let swapped;

//   do {
//     swapped = false;
//     console.log(arr);
//     arr.forEach((item, index) => {
//       if (item > arr[index + 1]) {
//         // Save the value to a variable so we don't lose it
//         let temp = item;
//         arr[index] = arr[index + 1];
//         arr[index + 1] = temp;
//         swapped = true;
//       }
//     });
//   } while (swapped);
// }
