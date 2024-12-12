# Split Bill Frontend

This app implements a simple split bill system where an organizer can create a bill, add participants and settle the bill after a complete contribution

## Features

- **Create Bill:** Allows an organizer to create a bill and add participants.
- **Contribute:** Allows any of the participants to contribute.
- **Settle Bill:** Allows the organizer to pay a recipient upon completion.
- **Check Status:** Checks the status and details of any bill created.

## Error Handling

- **`require()`**
- **`revert()`**
- **`assert()`**

## Events

- BillCreated(uint256 billId, address organizer, uint256 totalAmount);
- ContributionMade(uint256 billId, address participant, uint256 amount);
- BillSettled(uint256 billId, address recipient);

## License

This project is licensed under the MIT License.
