pragma solidity ^0.7.0;
import "@openzeppelin/contracts/math/SafeMath.sol";
contract maturePropertyContract {
    using SafeMath for uint256;
    uint256 public totalarea;
    uint256 public totaltokens;
    uint256 public circulationsupply;
    string public name;
    string public symbol;
    uint8 public decimals;
    address public daowallet;
    mapping(address => bool) admins;
    mapping(address => uint256) public balances;
    event Transfer(address indexed from, address indexed to, uint256 value);
    event withdraw(address indexed from, uint256 amount);
    constructor(uint256 _totalarea,string memory _name,string memory _symbol,uint8 _divisions)  {
        admins[msg.sender] = true;
        decimals = _divisions;
        totalarea = _totalarea * (uint256(10) ** _divisions);
        totaltokens = totalarea;
        circulationsupply = totaltokens;
        name = _name;
        symbol = _symbol;
        daowallet = msg.sender;
        balances[daowallet] = circulationsupply;
    }
    function addAdmin(address _adminAddress) external onlyAdmin {
        admins[_adminAddress] = true;
    }
    function removeAdmin(address _adminAddress) external onlyAdmin {
        admins[_adminAddress] = false;
    }
    /* Transfer tokens from one investor to another (sell process) */
    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) public onlyAdmin returns (bool) {
        require(_from != address(0), "ERC20: transfer from the zero address");
        require(_to != address(0), "ERC20: transfer to the zero address");
        require(balances[_from] >= _amount);
        balances[_from] = balances[_from].sub(_amount);
        balances[_to] = balances[_to].add(_amount);
        emit Transfer(_from, _to, _amount);
        return true;
    }
    /* Function to issue tokens to new investors */
    function transfer(address _to, uint256 _amount)
        public
        onlyAdmin
        returns (bool)
    {
        //require(_from != address(0), "ERC20: transfer from the zero address");
        require(_to != address(0), "ERC20: transfer to the zero address");
        require(balances[msg.sender] >= _amount);
        balances[msg.sender] = balances[msg.sender].sub(_amount);
        balances[_to]= balances[_to].add(_amount);
        emit Transfer(msg.sender, _to, _amount);
        return true;
    }
    /* Liquidate tokens from investors.	*/
    function withdrawl(address _from, uint256 _amount) public onlyAdmin {
        require(balances[_from] >= _amount);
        balances[_from] = balances[_from].sub(_amount);
        circulationsupply = circulationsupply.sub(_amount);
        emit withdraw(_from, _amount);
    }
    /*  Function to lock tokens */
    /* Fetch balance of user	*/
    function balanceOf(address _address) public view returns (uint256) {
        return balances[_address];
    }
    /* fetch total tokens		*/
    function totalSupply() public view returns (uint256) {
        return totalarea;
    }
    function multisend(address[] calldata _from, address[] calldata _to, uint256[] calldata _values ) public onlyAdmin returns (bool) {
        require(_from.length == _to.length);
        for (uint8 i; i < _from.length; i++) {
        transferFrom(_from[i],_to[i],_values[i]);
    }
        return true;
    }
    /* if conditions for admin purposes.
     */
    modifier onlyAdmin() {
        require(admins[msg.sender]);
        _;
    }
}