// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract ManualToken {
    // Public variables of the token
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    // 18 decimals is the strongly suggested default, avoid changing it
    uint256 public totalSupply;

    // holds the token balance of each owner account
    mapping(address => uint256) public balanceOf;
    // all of the accounts approved to withdraw from a given account together with the withdrawal sum allowed for each
    mapping(address => mapping(address => uint256)) public allowance;

    // This generates a public event on the blockchain that will notify clients/frontend apps
    event Transfer(address indexed from, address indexed to, uint256 value);

    // This generates a public event on the blockchain that will notify clients/frontend apps
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    // This notifies clients/frontend apps about the amount burnt
    event Burn(address indexed from, uint256 value);

    constructor(
        uint256 initialSupply,
        string memory tokenName, // e.g.  Uniswap
        string memory tokenSymbol // e.g.  UNI
    ) {
        totalSupply = initialSupply;
        balanceOf[msg.sender] = totalSupply; // Give the creator all initial tokens
        name = tokenName; // Set the name for display purposes
        symbol = tokenSymbol; // Set the symbol for display purposes
    }

    // Internal transfer, only can be called by this contract
    function _transfer(
        address _from,
        address _to,
        uint256 _value
    ) internal {
        // Prevent transfer to 0x0 address. Use the burn() function instead
        require(_to != address(0x0));
        // Check if the sender has enough
        require(balanceOf[_from] >= _value);
        // Check for overflows
        require(balanceOf[_to] + _value >= balanceOf[_to]);
        // Save this for an assertion in the future
        uint256 previousBalances = balanceOf[_from] + balanceOf[_to];
        // Subtract from the sender
        balanceOf[_from] -= _value;
        // Add the same to the recipient
        balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
        // Asserts are used to use static analysis to find bugs in your code. They should never fail
        assert(balanceOf[_from] + balanceOf[_to] == previousBalances);
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        _transfer(msg.sender, _to, _value);
        return true;
    }

    // The transferFrom function is the peer of the approve function
    // It allows a delegate approved for withdrawal to transfer owner funds to a third-party account.
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(_value <= allowance[_from][msg.sender]); // Check allowance
        allowance[_from][msg.sender] -= _value;
        _transfer(_from, _to, _value);
        return true;
    }

    // allow an owner to approve a delegate account to withdraw tokens from his account and
    // to transfer them to other accounts.
    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function burn(uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value); // Check if the sender has enough
        balanceOf[msg.sender] -= _value; // Subtract from the sender
        totalSupply -= _value; // Updates totalSupply
        emit Burn(msg.sender, _value);
        return true;
    }
}
