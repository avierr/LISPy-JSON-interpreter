let program = [
  { def: { 'a': 10 } },
  { def: { 'b': 20 } },
  {
    if: { '>': [{ val: 'a' }, { val: 'b' }] },
    then: [{ print: 'a is greater than b' }],
    else: [{ print: 'b is greater than a' }]
  }
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
  let returnValue;
  for (let stmt of program) {
    returnValue = exec(stmt, state)
  }
  return returnValue;
};

varDefinition = (defObj, state) => {
  let variable = Object.keys(defObj)[0];
  state[variable] = exec(defObj[variable], state)
}

varValue = (varKey, state) => { return state[varKey] }

let ifStatement = (stmt, key, state) => {
  let condition = stmt[key]
  if (exec(condition, state)) {
    let thenStatements = stmt['then']
    return interpret(thenStatements, state)
  } else {
    let elseStatements = stmt['else'];
    if (typeof elseStatements !== 'undefined') {
      return interpret(elseStatements, state)
    }
  }
}

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
  } else if (key === 'if') {
    return ifStatement(stmt, key, state)
  } else {
    console.error('unknown instruction: ' + key)
  }
}

interpret(program, {})