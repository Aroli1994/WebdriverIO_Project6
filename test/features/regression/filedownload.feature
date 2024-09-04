Feature: Validate download functionality

  Scenario Outline: Test file download
    Given user opens url <pageUrl> of the page
    When I click on first file
    Then I validate downloaded file extension

    Examples:
      | pageUrl                                     |
      | https://the-internet.herokuapp.com/download |
