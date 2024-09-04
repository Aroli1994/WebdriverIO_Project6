Feature: Check the header of the page

  Scenario Outline: Verify the header of the page
    Given user open the url <url> of the page
    Then user see the header <headervalue> of the page

    Examples:
      | url                                 | headervalue             |
      | https://the-internet.herokuapp.com/ | Welcome to the-internet |
