component extends="cfselenium.CFSeleniumTestCase" {

	function setUp() {
		browserUrl = "http://wiki.mxunit.org/";
        super.setUp();
	}
	
    function shouldBeAbleToStartAndStopABrowser() {
    	// the asserts for this are in setUp and tearDown
	}

	function parseCSVShouldWork() {
		
		input = "veni\, vidi\, vici,c:\\foo\\bar,c:\\I came\, I \\saw\\\, I conquered";
		expected = ["veni, vidi, vici", "c:\foo\bar", "c:\i came, i \saw\, i conquered"];
		debug(selenium.parseCSV(input));
		assertEquals(expected,selenium.parseCSV(input));
		
	}

	function testOpen() {
		
		selenium.open("/pages/viewpage.action?pageId=786471");
        //assertEndsWith("html/test_open.html", selenium.getLocation());
        //assertEquals("This is a test of the open command.", selenium.getBodyText());
        debug(selenium.getAllLinks());
        debug(selenium.getLocation());
        debug(selenium.getBodyText());

	}
	
}

