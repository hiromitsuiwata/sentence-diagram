class Word {
  id: number = 0;
  text: string = '';
  separator?: string = '';
  direction?: string = '';
  parentId?: number = 0;
  relation?: string = '';
  childOrder?: number = -1;
}

export default Word;
