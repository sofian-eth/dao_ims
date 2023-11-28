pragma solidity ^0.7.0;
import "@openzeppelin/contracts/math/SafeMath.sol";

contract ProjectContract {
    using SafeMath for uint256;
    uint256 public totalarea;
    uint256 public totaltokens;
    uint256 public circulationsupply;
    string public name;
    string public symbol;
    uint8 public decimals;

    address public daowallet;
    address public timelockcontractaddress;

  
    mapping(address => bool) admins;
    mapping(address => uint256) public balances;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event withdraw(address indexed from, uint256 amount);
    event unlockedfunds(string);
    event lockfunds(string, uint256);

    constructor(
        uint256 _totalarea,
        string memory _name,
        string memory _symbol,
        uint8 _divisions
    ) public {
        admins[msg.sender] = true;
        decimals = _divisions;
        totalarea = _totalarea * (uint256(10) ** _divisions);
        totaltokens = totalarea;
        circulationsupply = totaltokens;
        name = _name;
        symbol = _symbol;
       
        daowallet = msg.sender;
        balances[daowallet] = circulationsupply;

        //  Fire up timelock contract

        timelockcontract();
    }

    function timelockcontract() internal {
        // sending parent contract address to timelock contract so that functions of timelock contract can only be called by parent contract.
        ProjectTimeLock timelock = new ProjectTimeLock(address(this));

        // storing timelock contract address in parent contract for documentation purposes.
        timelockcontractaddress = address(timelock);
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
        //   balances[_from] = balances[_from]-amount;
        // balances[_to] = balances[_to]+ amount;
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

    function developmentRounds(
        string memory _name,
        uint256 _tokens,
        uint256 _starttime,
        uint256 _endtime
    ) public onlyAdmin returns (bool success) {
        require(_tokens <= circulationsupply);
        ProjectTimeLock timelock = ProjectTimeLock(timelockcontractaddress);
        balances[daowallet] = balances[daowallet].sub(_tokens);
        circulationsupply = circulationsupply.sub(_tokens);
        timelock.depositaddress(_name, _tokens, _starttime, _endtime);
        emit lockfunds(_name, _tokens);
        return true;
    }

    /* Function to release tokens */

    function releasefunds(string memory _name) public onlyAdmin {
        ProjectTimeLock timelock = ProjectTimeLock(timelockcontractaddress);
        timelock.withdrawltokens(_name);
        emit unlockedfunds(_name);
    }

    function deposittimelock(uint256 _amount) public childcontract {
        balances[daowallet] = balances[daowallet].add(_amount);
        circulationsupply = circulationsupply.add(_amount);
    }

    /* Get vesting details of locked tokens. */

    function getvestingdetails(string memory _name)
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            address
        )
    {
        ProjectTimeLock timelock = ProjectTimeLock(timelockcontractaddress);
        return timelock.getvestingdetails(_name);
    }

    /* Fetch balance of user	*/

    function balanceOf(address _address) public view returns (uint256) {
        return balances[_address];
    }

    /* fetch total tokens		*/

    function totalSupply() public view returns (uint256) {
        return totalarea;
    }

    /* if conditions for admin purposes.
     */
    modifier onlyAdmin() {
        require(admins[msg.sender]);
        _;
    }

    modifier childcontract() {
        require(msg.sender == timelockcontractaddress);
        _;
    }
}

// Timelock contract //

contract ProjectTimeLock {
    struct Vestingperiod {
        uint256 totalsupply;
        uint256 starttime;
        uint256 endtime;
        address owneraddress;
    }

    address public maincontract;
    ProjectContract c;

    // mapping for vesting stages

    mapping(string => Vestingperiod) public vestingstages;

    constructor(address _maincontract) public {
        c = ProjectContract(_maincontract);
        maincontract = _maincontract;
    }

    function depositaddress(
        string memory name,
        uint256 _tokensupply,
        uint256 _starttime,
        uint256 _endtime
    ) public onlymaincontract returns (bool success) {
        vestingstages[name] = Vestingperiod(
            _tokensupply,
            _starttime,
            _endtime,
            msg.sender
        );
        return true;
    }

    function withdrawltokens(string memory _name)
        public
        payable
        onlymaincontract
        returns (bool success)
    {
        require(vestingstages[_name].starttime <= block.timestamp);
        uint256 amount = vestingstages[_name].totalsupply;
        vestingstages[_name].totalsupply = 0;
        c.deposittimelock(amount);
        return true;
    }

    function getvestingdetails(string memory _name)
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            vestingstages[_name].totalsupply,
            vestingstages[_name].starttime,
            vestingstages[_name].endtime,
            vestingstages[_name].owneraddress
        );
    }

    modifier onlymaincontract() {
        require(maincontract == msg.sender);
        _;
    }
}
