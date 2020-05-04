import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor() { }

  max(array) {
  return Math.max.apply(null, array);
 }

 min(array) {
  return Math.min.apply(null, array);
 }

 range(array) {
  return this.max(array) - this.min(array);
 }

 midrange(array) {
  return this.range(array) / 2;
 }

 sum(array) {
  let num = 0;
  for (let i = 0, l = array.length; i < l; i++) { num += array[i]; }
  return num;
 }

 mean(array) {
  return this.sum(array) / array.length;
 }

 median(array) {
  array.sort((a, b) => {
   return a - b;
  });
  const mid = array.length / 2;
  return mid % 1 ? array[mid - 0.5] : (array[mid - 1] + array[mid]) / 2;
 }

 modes(array) {
  if (!array.length) { return []; }
  const modeMap = {};
  let maxCount = 0;
  let modes = [];

  array.forEach((val) => {
   if (!modeMap[val]) { modeMap[val] = 1; } else { modeMap[val]++; }

   if (modeMap[val] > maxCount) {
    modes = [val];
    maxCount = modeMap[val];
   } else if (modeMap[val] === maxCount) {
    modes.push(val);
    maxCount = modeMap[val];
   }
  });
  return modes;
 }

 variance(array) {
  const mean = this.mean(array);
  return this.mean(array.map((num) => {
   return Math.pow(num - mean, 2);
  }));
 }

 standardDeviation(array) {
  return Math.sqrt(this.variance(array));
 }

 meanAbsoluteDeviation(array) {
  const mean = this.mean(array);
  return this.mean(array.map((num) => {
   return Math.abs(num - mean);
  }));
 }

 zScores(array) {
  const mean = this.mean(array);
  const standardDeviation = this.standardDeviation(array);
  return array.map((num) => {
   return (num - mean) / standardDeviation;
  });
 }
filterOutliers(array) {

  if (array.length < 4) {
    return array;
  }

  let values, q1, q3, iqr, maxValue, minValue;

  values = array.slice().sort( (a, b) => a - b); // copy array fast and sort

  if ((values.length / 4) % 1 === 0) {// find quartiles
    q1 = 1 / 2 * (values[(values.length / 4)] + values[(values.length / 4) + 1]);
    q3 = 1 / 2 * (values[(values.length * (3 / 4))] + values[(values.length * (3 / 4)) + 1]);
  } else {
    q1 = values[Math.floor(values.length / 4 + 1)];
    q3 = values[Math.ceil(values.length * (3 / 4) + 1)];
  }

  iqr = q3 - q1;
  maxValue = q3 + iqr * 1.5;
  minValue = q1 - iqr * 1.5;

  return values.filter((x) => (x >= minValue) && (x <= maxValue));
}

}
