function LoneLexer(text) {
	var words = text.split(/\s+/);
	var next = 0;
	this.nextword = function() {
		if (next >= words.length) return null;
		return words[next++];
		
	};
}

function LoneCompiler() {
	this.dictionary= {};
	this.stack = [];
	this.addSyntax = function(newdict) {
		for (var key in newdict) {
			this.dictionary[key] = newdict[key];
		}
	};
	this.compile = function(text) {
		this.lexer = new LoneLexer(text);
		while ((word = this.lexer.nextword()) !== null) {
			numval = parseFloat(word);
			if (this.dictionary[word.toUpperCase()]) this.dictionary[word.toUpperCase()](this);
			else if (!isNaN(word)) this.stack.push(numval);
			else throw 'Unknown word';
		}
		return this.stack;
	};
	var makeVariableRule = function(val) {
		var v = { value: val };
		return function(compiler) { compiler.stack.push(v); };
	};
	this.declareVariable = function(word) {
		this.dictionary[word] = makeVariableRule(0);
	};
	this.defineVariable = function(word1, word2) { // assign value of word2 to word1
		if (!this.dictionary[word1]) throw 'Undeclared variable ' + word1;
		if (!isNaN(word2)) this.dictionary[word1] = makeVariableRule(word2);
		else { // word2 is a variable for now
			if (!this.dictionary[word2]) throw 'Undeclared variable ' + word2;
			this.dictionary[word2](this);
			var word2obj = this.stack.pop();
			this.dictionary[word1] = makeVariableRule(word2obj.value);
		}
	};
	this.returnVariable = function(word) {
		if (!this.dictionary[word]) throw 'Undeclared variable ' + word;
		this.dictionary[word](this);
		var wordobj = this.stack.pop();
		this.stack.push(wordobj.value);
	};
	this.getVariableValue = function(word) {
		// handles numbers, variables
		numval = parseFloat(word);
		if (!isNaN(word)) return numval;
		else if (this.dictionary[word]) {
			this.dictionary[word](this);
			var obj = this.stack.pop();
			return parseFloat(obj.value);
		} else throw 'Undeclared variable ' + word;
	};
	this.getExpressionValue = function(stk) {
		// expression has the form ( +|-|*|/|sqrt ... )
		if (stk.length === 1) return getVariableValue(stk[0]);
		if (stk.length < 5) throw 'Invalid expression';
		if (stk[1] === '+') {
			if (stk[2] !== '(') {
				if (stk[3] !== '(') return this.getVariableValue(stk[2]) + this.getVariableValue(stk[3]);
				else {
					var l = [];
					var c = 0;
					for (var i = 3; i < stk.length; i++) {
						l.push(stk[i]);
						if (stk[i] === '(') c++;
						if (stk[i] === ')') c--;
						if (c === 0) break;
					}
					return this.getVariableValue(stk[2]) + this.getExpressionValue(l);
				}
			} else {
				var l = [];
				var c = 0;
				var i;
				for (i = 2; i < stk.length; i++) {
					l.push(stk[i]);
					if (stk[i] === '(') c++;
					if (stk[i] === ')') c--;
					if (c === 0) break;
				}
				if (stk[++i] !== '(') return this.getExpressionValue(l) + this.getVariableValue(stk[i]);
				else {
					var m = [];
					var c = 0;
					var j;
					for (j = i; j < stk.length; j++) {
						m.push(stk[j]);
						if (stk[j] === '(') c++;
						if (stk[j] === ')') c--;
						if (c === 0) break;
					}
					return this.getExpressionValue(l) + this.getExpressionValue(m);
				}
			}
		} else if (stk[1] === '-') {
			if (stk[2] !== '(') {
				if (stk[3] !== '(') return this.getVariableValue(stk[2]) - this.getVariableValue(stk[3]);
				else {
					var l = [];
					var c = 0;
					for (var i = 3; i < stk.length; i++) {
						l.push(stk[i]);
						if (stk[i] === '(') c++;
						if (stk[i] === ')') c--;
						if (c === 0) break;
					}
					return this.getVariableValue(stk[2]) - this.getExpressionValue(l);
				}
			} else {
				var l = [];
				var c = 0;
				var i;
				for (i = 2; i < stk.length; i++) {
					l.push(stk[i]);
					if (stk[i] === '(') c++;
					if (stk[i] === ')') c--;
					if (c === 0) break;
				}
				if (stk[++i] !== '(') return this.getExpressionValue(l) - this.getVariableValue(stk[i]);
				else {
					var m = [];
					var c = 0;
					var j;
					for (j = i; j < stk.length; j++) {
						m.push(stk[i]);
						if (stk[j] === '(') c++;
						if (stk[j] === ')') c--;
						if (c === 0) break;
					}
					return this.getExpressionValue(l) - this.getExpressionValue(m);
				}
			}
		} else if (stk[1] === '*') {
			if (stk[2] !== '(') {
				if (stk[3] !== '(') return this.getVariableValue(stk[2]) * this.getVariableValue(stk[3]);
				else {
					var l = [];
					var c = 0;
					for (var i = 3; i < stk.length; i++) {
						l.push(stk[i]);
						if (stk[i] === '(') c++;
						if (stk[i] === ')') c--;
						if (c === 0) break;
					}
					return this.getVariableValue(stk[2]) * this.getExpressionValue(l);
				}
			} else {
				var l = [];
				var c = 0;
				var i;
				for (i = 2; i < stk.length; i++) {
					l.push(stk[i]);
					if (stk[i] === '(') c++;
					if (stk[i] === ')') c--;
					if (c === 0) break;
				}
				if (stk[++i] !== '(') return this.getExpressionValue(l) * this.getVariableValue(stk[i]);
				else {
					var m = [];
					var c = 0;
					var j;
					for (j = i; j < stk.length; j++) {
						m.push(stk[j]);
						if (stk[j] === '(') c++;
						if (stk[j] === ')') c--;
						if (c === 0) break;
					}
					return this.getExpressionValue(l) * this.getExpressionValue(m);
				}
			}
		} else if (stk[1] === '/') {
			if (stk[2] !== '(') {
				if (stk[3] !== '(') return this.getVariableValue(stk[2]) / this.getVariableValue(stk[3]);
				else {
					var l = [];
					var c = 0;
					for (var i = 3; i < stk.length; i++) {
						l.push(stk[i]);
						if (stk[i] === '(') c++;
						if (stk[i] === ')') c--;
						if (c === 0) break;
					}
					return this.getVariableValue(stk[2]) / this.getExpressionValue(l);
				}
			} else {
				var l = [];
				var c = 0;
				var i;
				for (i = 2; i < stk.length; i++) {
					l.push(stk[i]);
					if (stk[i] === '(') c++;
					if (stk[i] === ')') c--;
					if (c === 0) break;
				}
				if (stk[++i] !== '(') return this.getExpressionValue(l) / this.getVariableValue(stk[i]);
				else {
					var m = [];
					var c = 0;
					var j;
					for (j = i; j < stk.length; j++) {
						m.push(stk[j]);
						if (stk[j] === '(') c++;
						if (stk[j] === ')') c--;
						if (c === 0) break;
					}
					return this.getExpressionValue(l) / this.getExpressionValue(m);
				}
			}
		} else if (stk[1].toUpperCase() === 'SQRT') {
			if (stk[2] !== '(') {
				return Math.sqrt(this.getVariableValue(stk[2]));
			} else {
				var l = [];
				var c = 0;
				for (var i = 2; i < stk.length; i++) {
					l.push(stk[i]);
					if (stk[i] === '(') c++;
					if (stk[i] === ')') c--;
					if (c === 0) break;
				}
				return Math.sqrt(this.getExpressionValue(l));
			}
		} else throw 'Invalid expression';
	};
}

var VariableWords = {
		"VAR": function(compiler) { // var a
			var next = compiler.lexer.nextword();	// read one word ahead
			if (!next) throw 'Unexpected end of input';
			compiler.declareVariable(next);
		},
		"SET": function(compiler) { // set a 12; set a.value to 12
			var next = compiler.lexer.nextword();
			var _2next = compiler.lexer.nextword();	// read two words ahead
			if (!next || !_2next) throw 'Unexpected end of input';
			if (_2next === '(') {
				var exprval = compiler.dictionary[_2next](compiler);
				compiler.defineVariable(next, exprval);
			} else compiler.defineVariable(next, _2next);
		},
		"GET": function(compiler) { // get a; get a.value
			var next = compiler.lexer.nextword();
			if (!next) throw 'Unexpected end of input';
			compiler.returnVariable(next);
		}
		
};

var MathWords = {
		"+": function(compiler) {
			var next = compiler.lexer.nextword();
			var _2next;
			if (!next) throw 'Unexpected end of input';
			if (next === '(') {
				var exprval1 = compiler.dictionary[next](compiler);
				_2next = compiler.lexer.nextword();
				if (!_2next) throw 'unexpected end of input';
				if (_2next === '(') {
					var exprval2 = compiler.dictionary[_2next](compiler);
					compiler.stack.push(exprval1 + exprval2);
				} else compiler.stack.push(exprval1 + compiler.getVariableValue(_2next));
			} else {
				_2next = compiler.lexer.nextword();
				if (!_2next) throw 'unexpected end of input';
				if (_2next === '(') {
					var exprval = compiler.dictionary[_2next](compiler);
					compiler.stack.push(compiler.getVariableValue(next) + exprval);
				} else compiler.stack.push(compiler.getVariableValue(next) + compiler.getVariableValue(_2next));
			}
		},
		"-": function(compiler) {
			var next = compiler.lexer.nextword();
			var _2next;
			if (!next) throw 'Unexpected end of input';
			if (next === '(') {
				var exprval1 = compiler.dictionary[next](compiler);
				_2next = compiler.lexer.nextword();
				if (!_2next) throw 'unexpected end of input';
				if (_2next === '(') {
					var exprval2 = compiler.dictionary[_2next](compiler);
					compiler.stack.push(exprval1 - exprval2);
				} else compiler.stack.push(exprval1 - compiler.getVariableValue(_2next));
			} else {
				_2next = compiler.lexer.nextword();
				if (!_2next) throw 'unexpected end of input';
				if (_2next === '(') {
					var exprval = compiler.dictionary[_2next](compiler);
					compiler.stack.push(compiler.getVariableValue(next) - exprval);
				} else compiler.stack.push(compiler.getVariableValue(next) - compiler.getVariableValue(_2next));
			}
		},
		"*": function(compiler) {
			var next = compiler.lexer.nextword();
			var _2next;
			if (!next) throw 'Unexpected end of input';
			if (next === '(') {
				var exprval1 = compiler.dictionary[next](compiler);
				_2next = compiler.lexer.nextword();
				if (!_2next) throw 'unexpected end of input';
				if (_2next === '(') {
					var exprval2 = compiler.dictionary[_2next](compiler);
					compiler.stack.push(exprval1 * exprval2);
				} else compiler.stack.push(exprval1 * compiler.getVariableValue(_2next));
			} else {
				_2next = compiler.lexer.nextword();
				if (!_2next) throw 'unexpected end of input';
				if (_2next === '(') {
					var exprval = compiler.dictionary[_2next](compiler);
					compiler.stack.push(compiler.getVariableValue(next) * exprval);
				} else compiler.stack.push(compiler.getVariableValue(next) * compiler.getVariableValue(_2next));
			}
		},
		"/": function(compiler) {
			var next = compiler.lexer.nextword();
			var _2next;
			if (!next) throw 'Unexpected end of input';
			if (next === '(') {
				var exprval1 = compiler.dictionary[next](compiler);
				_2next = compiler.lexer.nextword();
				if (!_2next) throw 'unexpected end of input';
				if (_2next === '(') {
					var exprval2 = compiler.dictionary[_2next](compiler);
					if (exprval2 === 0) throw 'Divide by zero';
					compiler.stack.push(exprval1 / exprval2);
				} else {
					var val2 = compiler.getVariableValue(_2next);
					if (val2 === 0) throw 'Divide by zero';
					compiler.stack.push(exprval1 / val2);
				}
			} else {
				_2next = compiler.lexer.nextword();
				if (!_2next) throw 'unexpected end of input';
				if (_2next === '(') {
					var exprval = compiler.dictionary[_2next](compiler);
					if (exprval === 0) throw 'Divide by zero';
					compiler.stack.push(compiler.getVariableValue(next) / exprval);
				} else {
					var val2 = compiler.getVariableValue(_2next);
					if (val2 === 0) throw 'Divide by zero';
					compiler.stack.push(compiler.getVariableValue(next) / val2);
				}
			}
		},
		"SQRT": function(compiler) {
			var next = compiler.lexer.nextword();
			if (!next) throw 'Unexpected end of input';
			if (next === '(') {
				var exprval = compiler.dictionary[next](compiler);
				if (exprval < 0) throw 'SQRT negative number';
				compiler.stack.push(Math.sqrt(exprval));
			} else {
				var val = compiler.getVariablaValue(next);
				if (val < 0) throw 'SQRT negative number';
				compiler.stack.push(Math.sqrt(val));
			}
		}
};

var ExpressionWords = {
		"(": function(compiler) {
			var stack = ['('];
			var cnt = 1;
			while (word = compiler.lexer.nextword()) {
				stack.push(word);
				if (word === '(') cnt++;
				if (word === ')') cnt--;
				if (cnt === 0) break;
			}
			if (cnt !== 0) throw 'Missing closing bracket';
			return compiler.getExpressionValue(stack);
		}
};