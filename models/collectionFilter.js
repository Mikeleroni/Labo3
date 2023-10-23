import Model from './model.js';
import Repository from './repository.js';

export default class CollectionFilter {
  constructor(objects, params, model) {
    this.objects = objects;
    this.params = params;
    this.model = model;
  }
  get() {
    console.log(this.params);
    if (this.params == null) {
      return this.objects;
    }
    else if (Object.keys(this.params).length > 0) {
      let key = Object.keys(this.params)[0];
      let keyValue = this.params[key].split(',');
      let keyValue2 = this.params[key];

      if (this.model.isMember(key)) {
        if(this.params[key].endsWith('*') && this.params[key].startsWith('*')){
          let newString = this.params[key].slice(1, -1);
          return this.objects.filter(item => item[key].includes(newString));
        }
        else if(this.params[key].startsWith('*'))
        {
          let newString = this.params[key].slice(1);
          return this.objects.filter(item => item[key].endsWith(newString));
        }
        else if(this.params[key].endsWith('*')){
          let newString = this.params[key].replace('*', '');
          return this.objects.filter(item => item[key].startsWith(newString));
        }
        else
        {
          return this.objects.filter(item => item[key] == (keyValue));
        }
        
      }
      if (Object.keys(this.params) == 'sort') {
        if (this.model.isMember(keyValue[0]) && keyValue.length <= 2) {
          if (keyValue[1] == 'desc') {
            return this.objects.sort((a, b) => a[keyValue[0]] > b[keyValue[0]] ? -1 : 1);
          }
          else if (keyValue[1] == null) {
            return this.objects.sort((a, b) => a[keyValue[0]] > b[keyValue[0]] ? 1 : -1);
          }
        }
      }
      if((Object.keys(this.params)[0] == 'limit' && Object.keys(this.params)[1] == 'offset') || Object.keys(this.params)[0] == 'limit'){
        if(this.params.limit != undefined && this.params.offset != undefined)
        {
          let limit = (this.params.limit * this.params.offset);
          let offset = parseInt(limit) + parseInt(this.params.limit);

          return this.objects.slice(limit, offset);
        }
        else{
          return this.objects.slice(0, this.params.limit);
        }
      }
      if(Object.keys(this.params) == 'field')
      {
        let result = {};
        for(let i = 0; i < keyValue.length; i++)
        {
          result[keyValue[i]] = [...new Set(this.objects.map(item => item[keyValue[i]]))];
        }
        return [result];
      }
    }
  }


}
function valueMatch(value, searchValue) {
  try {
    let exp = '^' + searchValue.toLowerCase().replace(/\*/g, '.*') + '$';
    return new RegExp(exp).test(value.toString().toLowerCase());
  } catch (error) {
    console.log(error);
    return false;
  }
}
function compareNum(x, y) {
  if (x === y) return 0;
  else if (x < y) return -1;
  return 1;
}
function innerCompare(x, y) {
  if ((typeof x) === 'string')
    return x.localeCompare(y);
  else
    return compareNum(x, y);
}