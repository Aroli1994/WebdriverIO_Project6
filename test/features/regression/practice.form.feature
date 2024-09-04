Feature: Practice form page

  Scenario Outline: Test practice form
    Given I am on the practice page https://qavalidation.com/demo-form/
    Then I validate page header Demo form
    When I enter the fullname <name> and email <email>
    And I enter the phone number <mobile>
    And I select gender <gender>
    And I choose the years of experience <experience>
    And I select the skills <skills>
    And I select the QA tools <tools>
    And I enter other details <details>
    And I click on submit button
    Then I see the form is submitted having message <message> and link <link>

    Examples:
      | name          | email               | mobile     | gender | experience | skills     | tools  | details    | message                    | link    | 
      | vinay krishna | vk1062986@gmail.com | 6361094954 | Female | Above 5    | DB testing | Appium | study well | Your message has been sent | Go back |
