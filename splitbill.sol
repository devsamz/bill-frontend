// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SplitBill {
    struct Bill {
        address organizer;
        uint256 totalAmount;
        uint256 amountPaid;
        address[] participants;
        mapping(address => uint256) contributions;
        bool isSettled;
   }

   uint256 public billCount;
   mapping(uint256 => Bill) public bills;

   event BillCreated(uint256 billId, address organizer, uint256 totalAmount);
   event ContributionMade(uint256 billId, address participant, uint256 amount);
   event BillSettled(uint256 billId, address recipient);

   function createBill(uint256 _totalAmount, address[] memory _participants) external {
        require(_totalAmount > 0, "Total amount must be greater than zero");
        require(_participants.length > 0, "Must have at least one participant");

        billCount++;
        Bill storage newBill = bills[billCount];
        newBill.organizer = msg.sender;
        newBill.totalAmount = _totalAmount;
        newBill.participants = _participants;

        emit BillCreated(billCount, msg.sender, _totalAmount);
   }

   function contribute(uint256 _billId) external payable  {
        Bill storage bill = bills[_billId];
        if (!isParticipant(bill.participants, msg.sender)) {
            revert("You are not a participant");
        }
        require(msg.value > 0, "Contribution must be greater than zero");
        require(bill.contributions[msg.sender] == 0, "You have contributed before");

        bill.contributions[msg.sender] = msg.value;
        bill.amountPaid += msg.value;

        emit ContributionMade(_billId, msg.sender, msg.value);
        assert(bill.amountPaid <= bill.totalAmount);
   }

   function settleBill(uint256 _billId, address payable _recipient) external {
        Bill storage bill = bills[_billId];
        require(msg.sender == bill.organizer, "Only the organizer can settle the bill");
        require(bill.amountPaid == bill.totalAmount, "Bill is not fully paid");

        _recipient.transfer(bill.totalAmount);
        bill.isSettled = true;
        emit BillSettled(_billId, _recipient);
   }

   function isParticipant(address[] memory participants, address contributor) private pure returns (bool) {
    for (uint256 i = 0; i < participants.length; i++) {
        if (participants[i] == contributor) {
            return true;
        }
    }
    return false;
   }
}