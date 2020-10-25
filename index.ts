// import * as Checker from './Checker';
// import { Type } from './Type';

enum Type{
  NULL ='null',
  UNDEFINED ='undefined',
  STRING ='string',
  NUMBER ='number',
  BOOLEAN ='boolean',
  ARRAY ='array',
  OBJECT ='object',
  FUNCTION ='function'
};

const Char = {
  EOL: "\r\n",
  BS: " ",
  TAB: "\t"
};

export function isUndefined(obj: any): boolean {
  return obj === undefined;
}

export function isNumber(obj: any): boolean {
  return typeof obj === Type.NUMBER;
}

export function isFunction(obj: any): boolean {
  return typeof obj === Type.FUNCTION;
}

export function isArray(obj: any): boolean {
  return Array.isArray(obj);
}

function getType(data: any){
  if (isFunction(data)) return Type.UNDEFINED;
  if (isArray(data)) return Type.ARRAY;
  return typeof data;
}

function repeat(str: string, times: number): string{
  if (!isNumber(times) || times <= 0) times = 0;
  return new Array<string>(times + 1).join(str);
}

function encode(data: any, isFormat: boolean = false, useBS: boolean = false, bsSize: number = 4): string|undefined{
  if (getType(data) === Type.UNDEFINED) return undefined;
  return isFormat ? format(data, 0, useBS, bsSize) : JSON.stringify(data);
}

function format(data: any, space: number = 0, useBS: boolean = false, bsSize: number = 4): string|undefined{
  let type = getType(data);
  if (type === Type.UNDEFINED) return undefined;

  let spaceChar = Char.TAB;
  useBS && (spaceChar = repeat(Char.BS, bsSize));

  let str = '';
  let child = space + 1;

  let spaceParent = repeat(spaceChar, space);
  let spaceChild = repeat(spaceChar, child);

  switch(type){
    case Type.ARRAY:
      str =  spaceParent + '[';
      
      data = data
      .map((value: any) => format(value, child, useBS, bsSize))
      .filter((value: any) => !isUndefined(value));
      
      if (data.length){
        str += Char.EOL + spaceChild;
        str += data.join("," + Char.EOL + spaceChild)
        str += Char.EOL + spaceParent;
      }
      
      str += ']';
    break;
    case Type.OBJECT:
      str = spaceParent + '{';

      let arr = Object.keys(data)
      .map(key => {
        let childFormat = format(data[key], child, useBS, bsSize);
        if (isUndefined(childFormat)) return undefined;
        return '"' + encode(key) + '": ' + childFormat.replace(/^\s+/g, '');
      })
      .filter(value => !isUndefined(value));

      if (arr.length){
        str += Char.EOL + spaceChild;
        str += arr.join("," + Char.EOL + spaceChild);
        str += Char.EOL + spaceParent;
      }

      str += '}';
    break;
    default:
      str += spaceParent + encode(data);
  }

  return str;
}
