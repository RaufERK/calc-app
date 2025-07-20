'use client';

import { useState } from 'react';

type Operation = '+' | '-' | '*' | '/' | null;

export default function Calculator() {
  const [display, setDisplay] = useState<string>('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<Operation>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);

  const clearAll = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const performOperation = (nextOperation: Operation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (
    firstValue: number,
    secondValue: number,
    operation: Operation,
  ): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    if (!previousValue || !operation) {
      return;
    }

    const inputValue = parseFloat(display);
    const newValue = calculate(previousValue, inputValue, operation);

    setDisplay(String(newValue));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const buttonClass =
    'w-16 h-16 m-1 text-xl font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  const numberButtonClass = `${buttonClass} bg-gray-200 hover:bg-gray-300 text-gray-800`;
  const operationButtonClass = `${buttonClass} bg-blue-500 hover:bg-blue-600 text-white`;
  const clearButtonClass = `${buttonClass} bg-red-500 hover:bg-red-600 text-white`;
  const equalsButtonClass = `${buttonClass} bg-green-500 hover:bg-green-600 text-white`;

  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded-2xl shadow-2xl">
      <div className="mb-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="text-right text-3xl font-mono text-gray-800 min-h-[2.5rem] flex items-center justify-end">
            {display}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {/* Clear button */}
        <button
          onClick={clearAll}
          className={`${clearButtonClass} col-span-2 w-auto`}
        >
          C
        </button>

        {/* Operations */}
        <button
          onClick={() => performOperation('/')}
          className={`${operationButtonClass} ${
            operation === '/' ? 'bg-blue-700' : ''
          }`}
        >
          ÷
        </button>
        <button
          onClick={() => performOperation('*')}
          className={`${operationButtonClass} ${
            operation === '*' ? 'bg-blue-700' : ''
          }`}
        >
          ×
        </button>

        {/* Numbers 7-9 */}
        <button onClick={() => inputDigit('7')} className={numberButtonClass}>
          7
        </button>
        <button onClick={() => inputDigit('8')} className={numberButtonClass}>
          8
        </button>
        <button onClick={() => inputDigit('9')} className={numberButtonClass}>
          9
        </button>
        <button
          onClick={() => performOperation('-')}
          className={`${operationButtonClass} ${
            operation === '-' ? 'bg-blue-700' : ''
          }`}
        >
          -
        </button>

        {/* Numbers 4-6 */}
        <button onClick={() => inputDigit('4')} className={numberButtonClass}>
          4
        </button>
        <button onClick={() => inputDigit('5')} className={numberButtonClass}>
          5
        </button>
        <button onClick={() => inputDigit('6')} className={numberButtonClass}>
          6
        </button>
        <button
          onClick={() => performOperation('+')}
          className={`${operationButtonClass} ${
            operation === '+' ? 'bg-blue-700' : ''
          }`}
        >
          +
        </button>

        {/* Numbers 1-3 */}
        <button onClick={() => inputDigit('1')} className={numberButtonClass}>
          1
        </button>
        <button onClick={() => inputDigit('2')} className={numberButtonClass}>
          2
        </button>
        <button onClick={() => inputDigit('3')} className={numberButtonClass}>
          3
        </button>
        <button
          onClick={performCalculation}
          className={`${equalsButtonClass} row-span-2 h-auto`}
        >
          =
        </button>

        {/* Number 0 and decimal */}
        <button
          onClick={() => inputDigit('0')}
          className={`${numberButtonClass} col-span-2 w-auto`}
        >
          0
        </button>
        <button onClick={inputDecimal} className={numberButtonClass}>
          .
        </button>
      </div>
    </div>
  );
}
