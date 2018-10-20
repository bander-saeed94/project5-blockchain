const createKeccakHash = require('keccak')
const StarNotary = artifacts.require('StarNotary')

contract('StarNotary', accounts => {

    // StarNotary.deployed().then(instance => {

    //     console.log(instance.abi);

    // });
    let defaultAccount = accounts[0]
    let user1 = accounts[1];
    let user2 = accounts[2];
    let user3 = accounts[3];

    let name = 'awesome star!';
    let story = "I love my wonderful star";
    let dec = "dec_121.874";
    let mag = "mag_245.978";
    let cent = "ra_032.155";

    beforeEach(async function () {
        this.contract = await StarNotary.new({ from: accounts[0] })
    })


    describe('can create a star', () => {

        beforeEach(async function () {
            await this.contract.createStar(name, story, cent, dec, mag, { from: user1 })
        })
        it('tokenIdToStarInfo can create a star and get its name, story and corrd ', async function () {
            let star = await this.contract.tokenIdToStarInfo(1);
            assert.equal(star[0], name)
            assert.equal(star[1], story)
            assert.equal(star[2], cent)
            assert.equal(star[3], dec)
            assert.equal(star[4], mag)
        })

        it('can create more than one star', async function () {
            dec = "dd.145";
            await this.contract.createStar(name, story, cent, dec, mag, { from: user1 })
            let star = await this.contract.tokenIdToStarInfo(2);

            assert.equal(star[0], name)
            assert.equal(star[1], story)
            assert.equal(star[2], cent)
            assert.equal(star[3], dec)
            assert.equal(star[4], mag)
        })

        it('can not create a star that already created of the same coord', async function () {
            await expectThrow(this.contract.createStar(name, story, cent, dec, mag, { from: user1 }))
        })

    })

    describe('put up a star for sale', () => {
        beforeEach(async function () {
            await this.contract.createStar(name, story, dec, mag, cent, { from: user1 })
            await this.contract.createStar(name, story, cent, 'dec123.123', mag, { from: user1 })

        })
        it('put up a star for sale', async function () {
            let starPrice = web3.toWei(0.1, "ether")
            await this.contract.putStarUpForSale(1, starPrice, { from: user1 })
            assert.equal(await this.contract.starsForSale(1), starPrice)
        })
        it('non owner cant put up a star for sale', async function () {
            let starPrice = web3.toWei(0.1, "ether")
            await expectThrow(this.contract.putStarUpForSale(2, starPrice, { from: user2 }))
        })

        describe('starsForSale', ()=>{
            beforeEach(async function(){
                let starPrice = web3.toWei(0.1, "ether")
                await this.contract.putStarUpForSale(1, starPrice, { from: user1 })       
            })

            it('star with tokenId 1 for sale', async function(){
                assert.notEqual(await this.contract.starsForSale(1), 0)
            })
            it('star with tokenId 2 not for sale', async function(){
                assert.equal(await this.contract.starsForSale(2), 0)
            })
        })
    })

    describe('buy a star', () => {
        let tokenId = 1
        beforeEach(async function () {
            await this.contract.createStar(name, story, cent, dec, mag, { from: user1 })
        })

        it('another user can buy a star that being put up for sale', async function () {
            let starPrice = web3.toWei(0.1, "ether")
            await this.contract.putStarUpForSale(tokenId, starPrice, { from: user1 })
            await this.contract.buyStar(tokenId, { from: user2, value: starPrice })
            assert.equal(await this.contract.ownerOf(tokenId), user2)
        })
        it('same user cant buy a star that he put up for sale', async function () {
            let starPrice = web3.toWei(0.1, "ether")
            await this.contract.putStarUpForSale(1, starPrice, { from: user1 })
            await expectThrow(this.contract.buyStar(tokenId, { from: user1, value: starPrice }))
        })

        it('another user cant buy a star with lower than its price', async function () {
            let starPrice = web3.toWei(0.1, "ether")
            let sendEther = web3.toWei(0.01, "ether")
            await this.contract.putStarUpForSale(1, starPrice, { from: user1 })
            await expectThrow(this.contract.buyStar(tokenId, { from: user2, value: sendEther }))
        })
        it('user gets change', async function () {
            let starPrice = web3.toWei(0.1, "ether")
            let overpaidAmount = web3.toWei(0.2, "ether")
            await this.contract.putStarUpForSale(tokenId, starPrice, { from: user1 })

            const balanceOfUser2BeforeTransaction = web3.eth.getBalance(user2)
            await this.contract.buyStar(tokenId, { from: user2, value: overpaidAmount, gasPrice: 0 })
            const balanceAfterUser2BuysStar = web3.eth.getBalance(user2)

            assert.equal(balanceOfUser2BeforeTransaction.sub(balanceAfterUser2BuysStar), starPrice)
        })
    })

    describe('user sell a star', () => {
        let tokenId = 1
        beforeEach(async function () {
            await this.contract.createStar(name, story, cent, dec, mag, { from: user1 })
        })

        it('user gets ether increased', async function () {
            let starPrice = web3.toWei(0.1, "ether")
            await this.contract.putStarUpForSale(tokenId, starPrice, { from: user1 })

            const balanceOfUser1BeforeTransaction = web3.eth.getBalance(user1)
            await this.contract.buyStar(tokenId, { from: user2, value: starPrice })
            const balanceOfUser1AfterTransaction = web3.eth.getBalance(user1)

            assert.equal(balanceOfUser1BeforeTransaction.add(starPrice).toNumber(), balanceOfUser1AfterTransaction.toNumber())
        })
    })

    describe('user can check if star being claimed', () => {
        let tokenId = 1
        beforeEach(async function () {
            await this.contract.createStar(name, story, cent, dec, mag, { from: user1 })
        })


        it('can find a star being claimed', async function () {
            let tx = await this.contract.checkIfStarExist(cent, dec, mag)
            assert.equal(tx.logs[0].event, 'IsStarClaimed')
            assert.equal(tx.logs[0].args._claimed, true)

            // assert.equal(await this.contract.checkIfStarExist(dec, mag, cent), true)
        })
        it('can find a star not being claimed', async function () {
            let tx = await this.contract.checkIfStarExist(cent, '', mag)
            assert.equal(tx.logs[0].event, 'IsStarClaimed')
            assert.equal(tx.logs[0].args._claimed, false)

            // assert.equal(await this.contract.checkIfStarExist(dec, mag, cent), true)
        })
    })

    describe('can approve', () => {
        let tokenId = 1
        let tx
        beforeEach(async function () {
            await this.contract.createStar(name, story, cent, dec, mag, { from: user1 })
            tx = await this.contract.approve(user2, tokenId, { from: user1 });
        })

        it('user2 approved', async function () {
            assert.equal(tx.logs[0].event, 'Approval')
            assert.equal(tx.logs[0].args.approved, user2)
        })
        it('user2 can set up star approved to sell', async function () {
            let starPrice = web3.toWei(0.1, "ether")
            await this.contract.putStarUpForSale(tokenId, starPrice, { from: user2 })
            assert.equal(await this.contract.starsForSale(tokenId), starPrice)
        })

        it('user3 cant put up star for sale', async function () {
            let starPrice = web3.toWei(0.1, "ether")
            await expectThrow(this.contract.putStarUpForSale(tokenId, starPrice, { from: user3 }))
        })
        it('user3 buy star', async function () {
            let starPrice = web3.toWei(0.1, "ether")
            await this.contract.putStarUpForSale(1, starPrice, { from: user2 })

            await this.contract.buyStar(tokenId, { from: user3, value: starPrice })
            assert.equal(await this.contract.ownerOf(tokenId), user3)
        })
        it('user1 get paid', async function () {
            let starPrice = web3.toWei(0.1, "ether")
            await this.contract.putStarUpForSale(1, starPrice, { from: user2 })

            const balanceOfUser1BeforeTransaction = web3.eth.getBalance(user1)
            await this.contract.buyStar(tokenId, { from: user3, value: starPrice })
            const balanceOfUser1AfterTransaction = web3.eth.getBalance(user1)
            assert.equal(balanceOfUser1BeforeTransaction.add(starPrice).toNumber(), balanceOfUser1AfterTransaction.toNumber())
        })
        it('star cant be bought after payment', async function () {
            let starPrice = web3.toWei(0.1, "ether")
            await this.contract.putStarUpForSale(1, starPrice, { from: user2 })
            await this.contract.buyStar(tokenId, { from: user3, value: starPrice })
            await expectThrow(this.contract.buyStar(tokenId, { from: user1, value: starPrice }))
            // assert.equal(await this.contract.ownerOf(tokenId), user3)
        })

        describe('get approved', () => {
            let tokenId = 1
            let tx
            it('user2 approved', async function () {
                assert.equal(await this.contract.getApproved(tokenId), user2)
            })
            it('user3 not approved', async function () {
                assert.notEqual(await this.contract.getApproved(tokenId), user3)
            })

        })
    })



    describe('safe transfer', () => {
        let tokenId = 1
        beforeEach(async function () {
            await this.contract.createStar(name, story, cent, dec, mag, { from: user1 })
        })

        it('owner can transfer ownership of star', async function () {
            await this.contract.safeTransferFrom(user1, user2, tokenId, { from: user1 })
            assert.equal(await this.contract.ownerOf(tokenId), user2)
        })
        it('Non owner cant transfer ownership of star', async function () {
            await expectThrow(this.contract.safeTransferFrom(user1, user3, tokenId, { from: user2 }))
            await expectThrow(this.contract.safeTransferFrom(user2, user3, tokenId, { from: user2 }))

            // assert.equal(await this.contract.ownerOf(tokenId), user2)
        })
    })
    describe('SetApprovalForAll', () => {
        let tokenId = 1
        let tx
        beforeEach(async function () {
            await this.contract.createStar(name, story, cent, dec, mag, { from: user1 })
            cent = "mag_245.971";
            await this.contract.createStar(name, story, cent, dec, mag, { from: user1 })
            tx = await this.contract.setApprovalForAll(user2, true, { from: user1 })
        })

        it('aprroved can transfer', async function () {
            await this.contract.safeTransferFrom(user1, user3, 1, { from: user2 })
            assert.equal(await this.contract.ownerOf(tokenId), user3)
           ///
            assert.notEqual(await this.contract.ownerOf(tokenId), user2)
            assert.equal(tx.logs[0].event, 'ApprovalForAll')

            //isApprovedForAll
            assert.equal(await this.contract.isApprovedForAll(user1, user2), true)
            assert.equal(await this.contract.isApprovedForAll(user2, user1), false)
       
        })
    })



})

var expectThrow = async function (promise) {
    try {
        await promise;
    } catch (error) {
        assert.exists(error)
        return
    }
    assert.fail('Expect an error but did not see one')
}