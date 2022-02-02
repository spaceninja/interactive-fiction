import { Ref } from 'vue';

export const sortByPriority = (a: Ref, b: Ref) => {
  if (!a.value.priority) a.value.priority = 0;
  if (!b.value.priority) b.value.priority = 0;
  return b.value.priority - a.value.priority;
};
