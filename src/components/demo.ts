import { useCounterStore } from "../store/useCounterStore";

function  Demo () {
  const { count, increment, decrement, reset } = useCounterStore();
console.log(count)
};

