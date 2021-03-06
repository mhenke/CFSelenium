/*
 * Format for Selenium Remote Control CFML client.
 */

load('remoteControl.js');

this.name = "cfml-rc-mxunit";

function useSeparateEqualsForArray() {
        return true;
}

function testMethodName(testName) {
        return "test" + capitalize(testName);
}

function assertTrue(expression) {
        return "assertTrue(" + expression.toString() + ");";
}

function verifyTrue(expression) {
        return "assertTrue(" + expression.toString() + ");";
}

function assertFalse(expression) {
        return "assertFalse(" + expression.toString() + ");";
}

function verifyFalse(expression) {
        return "assertFalse(" + expression.toString() + ");";
}

function assignToVariable(type, variable, expression) {
        return variable + " = " + expression.toString(); + ";";
}

function ifCondition(expression, callback) {
    return "if (" + expression.toString() + ") {\n" + callback() + "}";
}

function joinExpression(expression) {
    return "join(" + expression.toString() + ", ',')";
}

function waitFor(expression) {
        return "for (int second = 0;; second++) {\n" +
                "\tif (second >= 60) fail(\"timeout\");\n" +
                "\ttry { " + (expression.setup ? expression.setup() + " " : "") +
                "if (" + expression.toString() + ") break; } catch (Exception e) {}\n" +
                "\tsleep(1000);\n" +
                "}\n";
        //return "while (" + not(expression).toString() + ") { Thread.sleep(1000); }";
}

function assertOrVerifyFailure(line, isAssert) {
        var message = '"expected failure"';
    var failStatement = "fail(" + message + ");";
        return "try { " + line + " " + failStatement + " } catch (Throwable e) {}";
}

Equals.prototype.toString = function() {
    return this.e1.toString() + " eq " + this.e2.toString();
}

Equals.prototype.assert = function() {
        return "assertEquals(" + this.e1.toString() + ", " + this.e2.toString() + ");";
}

Equals.prototype.verify = function() {
        return "verifyEquals(" + this.e1.toString() + ", " + this.e2.toString() + ");";
}

NotEquals.prototype.toString = function() {
        return this.e1.toString() + " neq " + this.e2.toString();
}

NotEquals.prototype.assert = function() {
        return "assertNotEquals(" + this.e1.toString() + ", " + this.e2.toString() + ");";
}

NotEquals.prototype.verify = function() {
        return "verifyNotEquals(" + this.e1.toString() + ", " + this.e2.toString() + ");";
}

RegexpMatch.prototype.toString = function() {
		return "reFind(" + string(this.pattern) + "," + this.expression + ") gt 0";
		/* from the Java formatter
	        if (this.pattern.match(/^\^/) && this.pattern.match(/\$$/)) {
	                return this.expression + ".matches(" + string(this.pattern) + ")";
	        } else {
	                return "Pattern.compile(" + string(this.pattern) + ").matcher(" + this.expression + ").find()";
	        }
        */
}

function pause(milliseconds) {
        return "sleep(" + parseInt(milliseconds) + ");";
}

function echo(message) {
        return "trace(text=" + xlateArgument(message) + ");";
}

function statement(expression) {
        return expression.toString() + ';';
}

function array(value) {
        var str = 'new String[] {';
        for (var i = 0; i < value.length; i++) {
                str += string(value[i]);
                if (i < value.length - 1) str += ", ";
        }
        str += '}';
        return str;
}

function nonBreakingSpace() {
    return "\"\\u00a0\"";
}

CallSelenium.prototype.toString = function() {
        var result = '';
        if (this.negative) {
                result += '!';
        }
        if (options.receiver) {
                result += options.receiver + '.';
        }
        result += this.message;
        result += '(';
        for (var i = 0; i < this.args.length; i++) {
                result += this.args[i];
                if (i < this.args.length - 1) {
                        result += ', ';
                }
        }
        result += ')';
        return result;
}

function formatComment(comment) {
        return comment.comment.replace(/.+/mg, function(str) {
                        return "// " + str;
                });
}

/**
 * Returns a string representing the suite for this formatter language.
 *
 * @param testSuite  the suite to format
 * @param filename   the file the formatted suite will be saved as
 */
function formatSuite(testSuite, filename) {
    var suiteClass = /^(\w+)/.exec(filename)[1];
    suiteClass = suiteClass[0].toUpperCase() + suiteClass.substring(1);

    var formattedSuite = "import junit.framework.Test;\n"
        + "import junit.framework.TestSuite;\n"
        + "\n"
        + "public class " + suiteClass + " {\n"
        + "\n"
        + indents(1) + "public static Test suite() {\n"
        + indents(2) + "TestSuite suite = new TestSuite();\n";

    for (var i = 0; i < testSuite.tests.length; ++i) {
        var testClass = testSuite.tests[i].getTitle();
        formattedSuite += indents(2)
            + "suite.addTestSuite(" + testClass + ".class);\n";
    }

    formattedSuite += indents(2) + "return suite;\n"
        + indents(1) + "}\n"
        + "\n"
        + indents(1) + "public static void main(String[] args) {\n"
        + indents(2) + "junit.textui.TestRunner.run(suite());\n"
        + indents(1) + "}\n"
        + "}\n";

    return formattedSuite;
}

this.options = {
	    receiver: "selenium",
	    indent: '4',
	    initialIndents: '2'
	};

options.getHeader = function() {
    var timeout = options['global.timeout'] || '30000';
    return "component extends=\"cfselenium.CFSeleniumTestCase\" displayName=\"${className}\" {\n\n"
        + indents(1) + "public void function beforeTests() {\n"
        + indents(2) + "browserUrl = \"enter_starting_url_here\";\n"
        + indents(2) + "super.beforeTests();\n"
        + indents(2) + "selenium.setTimeout(" + timeout + ");\n"
        + indents(1) + "}\n\n"
        + indents(1) + "public void function ${methodName}() {\n";
}

options.footer = indents(1) + "}\n"
    + "}\n";

this.configForm = 
	'<description>Package</description>' +
	'<textbox id="options_packageName" />' +
	'<description>Superclass</description>' +
	'<textbox id="options_superClass" />' +
    '<description>Indent</description>' +
    '<menulist id="options_indent"><menupopup>' +
    '<menuitem label="Tab" value="tab" />' +
    '<menuitem label="2 spaces" value="2" />' +
    '<menuitem label="4 spaces" value="4" />' +
    '<menuitem label="8 spaces" value="8" />' +
    '</menupopup></menulist>';

