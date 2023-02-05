let program = [
  {
    fn: {
      'max': [['a', 'b'], [
        {
          if: { '>': [{ val: 'a' }, { val: 'b' }] },
          then: [{ val: 'a' }],
          else: [{ val: 'b' }]
        }
      ]]
    }
  },
  {
    print: { max: [3, 5] }
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
  state.vars[variable] = exec(defObj[variable], state)
}

varValue = (varKey, state) => { return state.vars[varKey] }

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

let fnStatement = (stmt, key, state) => {
  let fnDefinition = stmt[key];
  let fnName = Object.keys(fnDefinition)[0];
  let fnArgs = fnDefinition[fnName][0];
  let fnBody = fnDefinition[fnName][1];
  state.vars[fnName] = { args: fnArgs, body: fnBody }
}

let fnExec = (stmt, key, state) => {
  let fnName = key;
  let fnArgs = stmt[fnName];
  let fn = state.vars[fnName];
  let newState = { vars: {}, parent: state };
  for (let [index, argName] of fn.args.entries()) {
    newState.vars[argName] = fnArgs[index];
  }
  return interpret(fn.body, newState);
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
  } else if (key === 'fn') {
    return fnStatement(stmt, key, state)
  } else {
    if (typeof state.vars[key] !== 'undefined') {
      return fnExec(stmt, key, state)
    }
    console.error('unknown instruction: ' + key)
  }

}

interpret(program, { vars: {}, parent: null })