Feature: Test practice form

  Scenario: Validate form data with json file
    Given I am on form page "https://demoqa.com/automation-practice-form"
    When I enter all mandate fields
#And I submit the form
#Then I should see "Thanks for submitting the form"

  Scenario Outline: Validate form data with json file
    Given I am on form page "https://demoqa.com/automation-practice-form"
    When I enter all mandate fields from <filename>

    Examples:
      | filename       |
      | formdata2.json |
      | formdata3.json |
