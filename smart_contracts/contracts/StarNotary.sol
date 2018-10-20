pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 { 
    
    Star[] stars;
    struct Star { 
        string name; 
        string story;
        string cent;
        string dec;
        string mag;
        
    }

    mapping(bytes32 => uint256) public coordhashToTokenId;
    mapping(uint256 => Star) public tokenIdToStarInfo; 
    mapping(uint256 => uint256) public starsForSale;

    event IsStarClaimed(address _from, bool _claimed);


    function createStar(string _name, string _story, string _cent, string _dec, string _mag) public 
    returns(uint256){ 
        require(checkIfStarExist(_cent, _dec, _mag) == false, "star exist");//not being claimed
        Star memory _star = Star(_name, _story, _cent, _dec, _mag);
        uint256 newStarId = stars.push(_star);//No tokenId with zero


        tokenIdToStarInfo[newStarId] = _star;
        coordhashToTokenId[keccak256(strConcat(_cent, _dec, _mag))] = newStarId;

        _mint(msg.sender, newStarId);
        return newStarId;
    }

    // function mint(uint256 _tokenId) public{
    //     require(ownerOf(_tokenId) == address(0), "this token belongs to someone else already");
    //     _mint(msg.sender,_tokenId);
    // }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public { 
        require(_isApprovedOrOwner(msg.sender, _tokenId));

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable { 
        require(starsForSale[_tokenId] > 0);
        require(msg.sender != ownerOf(_tokenId));

        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);
        require(msg.value >= starCost);
        
        _clearApproval(starOwner, _tokenId);
        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);
        starsForSale[_tokenId] = 0;

        starOwner.transfer(starCost);

        if(msg.value > starCost) { 
            msg.sender.transfer(msg.value - starCost);
        }
    }

    //Utilizing star coordinates, 
    //this function will check if the coordinates have already been claimed. The return type is boolean.
    function checkIfStarExist(string _cent, string _dec, string _mag) public returns(bool) {
        bytes32 hashCorrd = keccak256(strConcat( _cent, _dec, _mag));
        if(coordhashToTokenId[hashCorrd] == 0 ){
            emit IsStarClaimed(msg.sender, false);
            return false;
        }
        else {
            emit IsStarClaimed(msg.sender, true);
            return true;
        }
    }


    function strConcat(string _a, string _b, string _c, string _d, string _e) internal returns (string){
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        bytes memory _bc = bytes(_c);
        bytes memory _bd = bytes(_d);
        bytes memory _be = bytes(_e);
        string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
        bytes memory babcde = bytes(abcde);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
        for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
        for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
        for (i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
        for (i = 0; i < _be.length; i++) babcde[k++] = _be[i];
        return string(babcde);
    }

    function strConcat(string _a, string _b, string _c, string _d) internal returns (string) {
        return strConcat(_a, _b, _c, _d, "");
    }

    function strConcat(string _a, string _b, string _c) internal returns (string) {
        return strConcat(_a, _b, _c, "", "");
    }

    function strConcat(string _a, string _b) internal returns (string) {
        return strConcat(_a, _b, "", "", "");
    }
}