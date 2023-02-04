let program = [
  { def: { 'a': 10 } },
  { def: { 'b': 20 } },
  { print: { '>': [{ val: 'b' }, { val: 'a' }] } },
  { print: { '<': [{ val: 'a' }, { val: 'b' }] } },
  { print: { '==': [{ val: 'a' }, { val: 'b' }] } },
  //b > a OR a == b
  { print: { '||': [{ '>': [{ val: 'b' }, { val: 'a' }] }, { '==': [{ val: 'a' }, { val: 'b' }] }] } },
  //b > a AND a ==b 
  { print: { '&&': [{ '>': [{ val: 'b' }, { val: 'a' }] }, { '==': [{ val: 'a' }, { val: 'b' }] }] } },
]

let builtins = {
  print: (text) => { console.log(text) }
}

let binaryOperators = {
  '+': (a, b) => { return a + b },
  '-': (a, b) => { return a - b },
  '*': (a, b) => { return a * b },
  '>': (a, b) => { return a > b },
  '<': (a, b) => { return a < b },
  '==': (a, b) => { return a == b },
  '||': (a, b) => { return a || b },
  '&&': (a, b) => { return a && b },
}

interpret = (program, state) => {
  for (let stmt of program) {
    exec(stmt, state)
  }
};

varDefinition = (defObj, state) => {
  let variable = Object.keys(defObj)[0];
  state[variable] = exec(defObj[variable], state)
}

varValue = (varKey, state) => { return state[varKey] }

exec = (stmt, state) => {

  if (typeof stmt === 'number' || typeof stmt === 'string') {
    return stmt;
  }

  let key = Object.keys(stmt)[0]
  if (typeof builtins[key] === 'function') {
    builtins[key](exec(stmt[key], state), state)
  } else if (typeof binaryOperators[key] === 'function') {
    let firstArgument = stmt[key][0];
    let secondArgument = stmt[key][1];
    return binaryOperators[key](exec(firstArgument, state), exec(secondArgument, state))
  } else if (key === 'def') {
    let firstArgument = stmt[key]
    return varDefinition(firstArgument, state)
  } else if (key === 'val') {
    let firstArgument = stmt[key]
    return varValue(firstArgument, state)
  } else {
    console.error('unknown instruction: ' + key)
  }
}

interpret(program, {})