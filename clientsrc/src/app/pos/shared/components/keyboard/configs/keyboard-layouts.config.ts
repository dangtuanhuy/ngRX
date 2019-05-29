import { KeyboardClassKey } from '../enums/keyboard-class-key.enum';
import { IKeyboardLayout } from '../interfaces/keyboard-layout.interface';
import { InjectionToken } from '@angular/core';
import { IKeyboardLayouts } from '../interfaces/keyboard-layouts.interface';

const MAT_KEYBOARD_LAYOUTS = new InjectionToken<IKeyboardLayouts>('keyboard-layouts.config');
const keyboardLayouts: IKeyboardLayouts = {
  '\u0627\u0644\u0639\u0631\u0628\u064a\u0629': {
    'name': 'Arabic',
    'keys': [
      [
        ['\u0630', '\u0651 '],
        ['1', '!', '\u00a1', '\u00b9'],
        ['2', '@', '\u00b2'],
        ['3', '#', '\u00b3'],
        ['4', '$', '\u00a4', '\u00a3'],
        ['5', '%', '\u20ac'],
        ['6', '^', '\u00bc'],
        ['7', '&', '\u00bd'],
        ['8', '*', '\u00be'],
        ['9', '(', '\u2018'],
        ['0', ')', '\u2019'],
        ['-', '_', '\u00a5'],
        ['=', '+', '\u00d7', '\u00f7'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u0636', '\u064e'],
        ['\u0635', '\u064b'],
        ['\u062b', '\u064f'],
        ['\u0642', '\u064c'],
        ['\u0641', '\u0644'],
        ['\u063a', '\u0625'],
        ['\u0639', '\u2018'],
        ['\u0647', '\u00f7'],
        ['\u062e', '\u00d7'],
        ['\u062d', '\u061b'],
        ['\u062c', '<'],
        ['\u062f', '>'],
        ['\\', '|']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0634', '\u0650'],
        ['\u0633', '\u064d'],
        ['\u064a', ']'],
        ['\u0628', '['],
        ['\u0644', '\u0644'],
        ['\u0627', '\u0623'],
        ['\u062a', '\u0640'],
        ['\u0646', '\u060c'],
        ['\u0645', '/'],
        ['\u0643', ':'],
        ['\u0637', '"'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u0626', '~'],
        ['\u0621', '\u0652'],
        ['\u0624', '}'],
        ['\u0631', '{'],
        ['\u0644', '\u0644'],
        ['\u0649', '\u0622'],
        ['\u0629', '\u2019'],
        ['\u0648', ','],
        ['\u0632', '.'],
        ['\u0638', '\u061f'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt]
      ]
    ],
    'lang': ['ar']
  }
};

const defaultKeyboardLayout: IKeyboardLayout = {
  name: 'US Standard',
  keys: [
    [
      ['`', '~'],
      ['1', '!'],
      ['2', '@'],
      ['3', '#'],
      ['4', '$'],
      ['5', '%'],
      ['6', '^'],
      ['7', '&'],
      ['8', '*'],
      ['9', '('],
      ['0', ')'],
      ['-', '_'],
      ['=', '+'],
      [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
    ],
    [
      [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
      ['q', 'Q'],
      ['w', 'W'],
      ['e', 'E'],
      ['r', 'R'],
      ['t', 'T'],
      ['y', 'Y'],
      ['u', 'U'],
      ['i', 'I'],
      ['o', 'O'],
      ['p', 'P'],
      ['[', '{'],
      [']', '}'],
      ['\\', '|']
    ],
    [
      [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
      ['a', 'A'],
      ['s', 'S'],
      ['d', 'D'],
      ['f', 'F'],
      ['g', 'G'],
      ['h', 'H'],
      ['j', 'J'],
      ['k', 'K'],
      ['l', 'L'],
      [';', ':'],
      ['\'', '"'],
      [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
    ],
    [
      [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
      ['z', 'Z'],
      ['x', 'X'],
      ['c', 'C'],
      ['v', 'V'],
      ['b', 'B'],
      ['n', 'N'],
      ['m', 'M'],
      [',', '<'],
      ['.', '>'],
      ['/', '?'],
      [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
    ],
    [
      [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space]
    ]
  ],
  'lang': ['en-US']
};

const numpadKeyboard: IKeyboardLayout = {
  name: 'US Standard Numpad',
  keys: [
    [
      ['1', '!'],
      ['2', '@'],
      ['3', '#']
    ],
    [
      ['4', '$'],
      ['5', '%'],
      ['6', '^']
    ],
    [
      ['7', '&'],
      ['8', '*'],
      ['9', '(']
    ],
    [
      ['.', '>'],
      ['0', ')'],
      [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
    ]
  ],
  'lang': ['en-US']
};

export { defaultKeyboardLayout, numpadKeyboard, keyboardLayouts, MAT_KEYBOARD_LAYOUTS };
