[Home](../index.md) &gt; [CombineTier](./combinetier.md)

# Class CombineTier

A class for deploying and calling methods on a CombineTier.

Implements `ReadOnlyTier` over RainVM. Allows combining the reports from any other `ITier` contracts referenced in the `ImmutableSource` set at construction. value at the top of the stack after executing the rain script will be used as the return of `report`<!-- -->.

This class provides an easy way to deploy CombineTiers using Rain's canonical factories, and methods for interacting with an already deployed CombineTier.

<b>Signature:</b>

```typescript
class CombineTier extends TierContract 
```

## Example


```typescript
import { CombineTier } from 'rain-sdk'

// To deploy a new CombineTier, pass an ethers.js Signer and the config for the CombineTier.
const newTier = await CombineTier.deploy(signer, CombineTierConfigArgs)

// To connect to an existing CombineTier just pass the address and an ethers.js Signer.
const existingTier = new CombineTier(address, signer)

// Once you have a CombineTier, you can call the smart contract methods:
const report = await existingTier.report(address)

```

## Static Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [deploy](./combinetier.md#deploy-property-static) | `(signer: Signer, args: CombineTierDeployArgs, overrides?: TxOverrides) => Promise<CombineTier>` | Deploys a new CombineTier. |
|  [getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static) | `(chainId: number) => Addresses` | Obtain all the addresses deployed in a specific network with a chain ID<br></br><i>Inherited from [AddressBook.getAddressesForChainId](./addressbook.md#getAddressesForChainId-property-static)</i> |
|  [getAlwaysTier](./combinetier.md#getAlwaysTier-property-static) | `(signer: Signer) => Promise<CombineTier>` | Get the instance Combine Tier connected to the deployed always tier in the current chain ID obtained with the provider |
|  [getChainId](./raincontract.md#getChainId-property-static) | `(signerOrProvider: Signer \| Provider) => Promise<number>` | Get the chain ID from a valid ethers provider.<br></br>Request to the provider stored in the signer which is the chain ID.<br></br><i>Inherited from [RainContract.getChainId](./raincontract.md#getChainId-property-static)</i> |
|  [isChild](./combinetier.md#isChild-property-static) | `(signer: Signer, maybeChild: string) => Promise<boolean>` | Checks if address is registered as a child contract of this CombineTierFactory on a specific network |
|  [nameBookReference](./combinetier.md#nameBookReference-property-static) | `` | Reference to find the address in the book address. Should be implemented and assign it to each subclass<br></br><i>Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)</i> |
|  [Opcodes](./combinetier.md#Opcodes-property-static) | <pre>{&#010;    ACCOUNT: number;&#010;    SKIP: AllStandardOps.SKIP;&#010;    VAL: AllStandardOps.VAL;&#010;    DUP: AllStandardOps.DUP;&#010;    ZIPMAP: AllStandardOps.ZIPMAP;&#010;    DEBUG: AllStandardOps.DEBUG;&#010;    BLOCK_NUMBER: AllStandardOps.BLOCK_NUMBER;&#010;    BLOCK_TIMESTAMP: AllStandardOps.BLOCK_TIMESTAMP;&#010;    SENDER: AllStandardOps.SENDER;&#010;    THIS_ADDRESS: AllStandardOps.THIS_ADDRESS;&#010;    SCALE18_MUL: AllStandardOps.SCALE18_MUL;&#010;    SCALE18_DIV: AllStandardOps.SCALE18_DIV;&#010;    SCALE18: AllStandardOps.SCALE18;&#010;    SCALEN: AllStandardOps.SCALEN;&#010;    SCALE_BY: AllStandardOps.SCALE_BY;&#010;    SCALE18_ONE: AllStandardOps.SCALE18_ONE;&#010;    SCALE18_DECIMALS: AllStandardOps.SCALE18_DECIMALS;&#010;    ADD: AllStandardOps.ADD;&#010;    SATURATING_ADD: AllStandardOps.SATURATING_ADD;&#010;    SUB: AllStandardOps.SUB;&#010;    SATURATING_SUB: AllStandardOps.SATURATING_SUB;&#010;    MUL: AllStandardOps.MUL;&#010;    SATURATING_MUL: AllStandardOps.SATURATING_MUL;&#010;    DIV: AllStandardOps.DIV;&#010;    MOD: AllStandardOps.MOD;&#010;    EXP: AllStandardOps.EXP;&#010;    MIN: AllStandardOps.MIN;&#010;    MAX: AllStandardOps.MAX;&#010;    ISZERO: AllStandardOps.ISZERO;&#010;    EAGER_IF: AllStandardOps.EAGER_IF;&#010;    EQUAL_TO: AllStandardOps.EQUAL_TO;&#010;    LESS_THAN: AllStandardOps.LESS_THAN;&#010;    GREATER_THAN: AllStandardOps.GREATER_THAN;&#010;    EVERY: AllStandardOps.EVERY;&#010;    ANY: AllStandardOps.ANY;&#010;    REPORT: AllStandardOps.REPORT;&#010;    NEVER: AllStandardOps.NEVER;&#010;    ALWAYS: AllStandardOps.ALWAYS;&#010;    SATURATING_DIFF: AllStandardOps.SATURATING_DIFF;&#010;    UPDATE_BLOCKS_FOR_TIER_RANGE: AllStandardOps.UPDATE_BLOCKS_FOR_TIER_RANGE;&#010;    SELECT_LTE: AllStandardOps.SELECT_LTE;&#010;    IERC20_BALANCE_OF: AllStandardOps.IERC20_BALANCE_OF;&#010;    IERC20_TOTAL_SUPPLY: AllStandardOps.IERC20_TOTAL_SUPPLY;&#010;    IERC721_BALANCE_OF: AllStandardOps.IERC721_BALANCE_OF;&#010;    IERC721_OWNER_OF: AllStandardOps.IERC721_OWNER_OF;&#010;    IERC1155_BALANCE_OF: AllStandardOps.IERC1155_BALANCE_OF;&#010;    IERC1155_BALANCE_OF_BATCH: AllStandardOps.IERC1155_BALANCE_OF_BATCH;&#010;    length: AllStandardOps.length;&#010;}</pre> | Constructs a new CombineTier from a known address. |

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [address](./raincontract.md#address-property) | `string` | <i>Inherited from [RainContract.address](./raincontract.md#address-property)</i> |
|  [connect](./combinetier.md#connect-property) | `(signer: Signer) => CombineTier` | Connect the current instance to a new signer<br></br><i>Overrides [RainContract.connect](./raincontract.md#connect-property)</i> |
|  [levels](./tiercontract.md#levels-property) | `typeof Tier` | All the contract tier levels.<br></br><i>Inherited from [TierContract.levels](./tiercontract.md#levels-property)</i> |
|  [report](./tiercontract.md#report-property) | `(account: string, overrides?: ReadTxOverrides) => Promise<BigNumber>` | A tier report is a `uint256` that contains each of the block numbers each tier has been held continously since as a `uint32`<!-- -->. There are 9 possible tier, starting with tier 0 for `0` offset or "never held any tier" then working up through 8x 4 byte offsets to the full 256 bits.<br></br><i>Inherited from [TierContract.report](./tiercontract.md#report-property)</i> |
|  [setTier](./combinetier.md#setTier-property) | `(account: string, endTier: BigNumberish, data: BytesLike, overrides?: TxOverrides \| undefined) => Promise<never>` | It is NOT implemented in CombineTiers. Always will throw an error<br></br><i>Overrides [TierContract.setTier](./tiercontract.md#setTier-property)</i> |
|  [signer](./raincontract.md#signer-property) | `Signer` | <i>Inherited from [RainContract.signer](./raincontract.md#signer-property)</i> |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [\_isChild(signer, maybeChild)](./factorycontract.md#_isChild-method-static-1) | Checks if address is registered as a child contract of the factory in the chain. Should be implemented in sub-classes that repreent factories to expose it.<br></br><i>Inherited from [FactoryContract.\_isChild()](./factorycontract.md#_isChild-method-static-1)</i> |
|  [getBookAddress(chainId)](./raincontract.md#getBookAddress-method-static-1) | Get the address stored in the book to this chain<br></br><i>Inherited from [RainContract.getBookAddress()](./raincontract.md#getBookAddress-method-static-1)</i> |
|  [getNewChildFromReceipt(receipt, parentContract)](./factorycontract.md#getNewChildFromReceipt-method-static-1) | Get the child from a receipt obtain from a Factory transaction<br></br><i>Inherited from [FactoryContract.getNewChildFromReceipt()](./factorycontract.md#getNewChildFromReceipt-method-static-1)</i> |

## Methods

|  Method | Description |
|  --- | --- |
|  [checkAddress(address, message)](./raincontract.md#checkAddress-method-1) | Check if an address is correctly formatted and throw an error if it is not an valid address<br></br><i>Inherited from [RainContract.checkAddress()](./raincontract.md#checkAddress-method-1)</i> |
|  [currentTier(account, block)](./tiercontract.md#currentTier-method-1) | Get the current tier of an `account` in the Tier as an expression between `[0 - 8]`<!-- -->. Tier 0 is that a address has never interact with the Tier Contract.<br></br><i>Inherited from [TierContract.currentTier()](./tiercontract.md#currentTier-method-1)</i> |

## Static Property Details

<a id="deploy-property-static"></a>

### deploy

Deploys a new CombineTier.

<b>Signature:</b>

```typescript
static deploy: (signer: Signer, args: CombineTierDeployArgs, overrides?: TxOverrides) => Promise<CombineTier>;
```

<a id="getAlwaysTier-property-static"></a>

### getAlwaysTier

Get the instance Combine Tier connected to the deployed always tier in the current chain ID obtained with the provider

<b>Signature:</b>

```typescript
static getAlwaysTier: (signer: Signer) => Promise<CombineTier>;
```

<a id="isChild-property-static"></a>

### isChild

Checks if address is registered as a child contract of this CombineTierFactory on a specific network

<b>Signature:</b>

```typescript
static isChild: (signer: Signer, maybeChild: string) => Promise<boolean>;
```

<a id="nameBookReference-property-static"></a>

### nameBookReference

Reference to find the address in the book address. Should be implemented and assign it to each subclass

<i>Overrides [RainContract.nameBookReference](./raincontract.md#nameBookReference-property-static)</i>

<b>Signature:</b>

```typescript
protected static readonly nameBookReference = "combineTierFactory";
```

<a id="Opcodes-property-static"></a>

### Opcodes

Constructs a new CombineTier from a known address.

<b>Signature:</b>

```typescript
static Opcodes: {
        ACCOUNT: number;
        SKIP: AllStandardOps.SKIP;
        VAL: AllStandardOps.VAL;
        DUP: AllStandardOps.DUP;
        ZIPMAP: AllStandardOps.ZIPMAP;
        DEBUG: AllStandardOps.DEBUG;
        BLOCK_NUMBER: AllStandardOps.BLOCK_NUMBER;
        BLOCK_TIMESTAMP: AllStandardOps.BLOCK_TIMESTAMP;
        SENDER: AllStandardOps.SENDER;
        THIS_ADDRESS: AllStandardOps.THIS_ADDRESS;
        SCALE18_MUL: AllStandardOps.SCALE18_MUL;
        SCALE18_DIV: AllStandardOps.SCALE18_DIV;
        SCALE18: AllStandardOps.SCALE18;
        SCALEN: AllStandardOps.SCALEN;
        SCALE_BY: AllStandardOps.SCALE_BY;
        SCALE18_ONE: AllStandardOps.SCALE18_ONE;
        SCALE18_DECIMALS: AllStandardOps.SCALE18_DECIMALS;
        ADD: AllStandardOps.ADD;
        SATURATING_ADD: AllStandardOps.SATURATING_ADD;
        SUB: AllStandardOps.SUB;
        SATURATING_SUB: AllStandardOps.SATURATING_SUB;
        MUL: AllStandardOps.MUL;
        SATURATING_MUL: AllStandardOps.SATURATING_MUL;
        DIV: AllStandardOps.DIV;
        MOD: AllStandardOps.MOD;
        EXP: AllStandardOps.EXP;
        MIN: AllStandardOps.MIN;
        MAX: AllStandardOps.MAX;
        ISZERO: AllStandardOps.ISZERO;
        EAGER_IF: AllStandardOps.EAGER_IF;
        EQUAL_TO: AllStandardOps.EQUAL_TO;
        LESS_THAN: AllStandardOps.LESS_THAN;
        GREATER_THAN: AllStandardOps.GREATER_THAN;
        EVERY: AllStandardOps.EVERY;
        ANY: AllStandardOps.ANY;
        REPORT: AllStandardOps.REPORT;
        NEVER: AllStandardOps.NEVER;
        ALWAYS: AllStandardOps.ALWAYS;
        SATURATING_DIFF: AllStandardOps.SATURATING_DIFF;
        UPDATE_BLOCKS_FOR_TIER_RANGE: AllStandardOps.UPDATE_BLOCKS_FOR_TIER_RANGE;
        SELECT_LTE: AllStandardOps.SELECT_LTE;
        IERC20_BALANCE_OF: AllStandardOps.IERC20_BALANCE_OF;
        IERC20_TOTAL_SUPPLY: AllStandardOps.IERC20_TOTAL_SUPPLY;
        IERC721_BALANCE_OF: AllStandardOps.IERC721_BALANCE_OF;
        IERC721_OWNER_OF: AllStandardOps.IERC721_OWNER_OF;
        IERC1155_BALANCE_OF: AllStandardOps.IERC1155_BALANCE_OF;
        IERC1155_BALANCE_OF_BATCH: AllStandardOps.IERC1155_BALANCE_OF_BATCH;
        length: AllStandardOps.length;
    };
```

## Property Details

<a id="connect-property"></a>

### connect

Connect the current instance to a new signer

<i>Overrides [RainContract.connect](./raincontract.md#connect-property)</i>

<b>Signature:</b>

```typescript
readonly connect: (signer: Signer) => CombineTier;
```

<a id="setTier-property"></a>

### setTier

It is NOT implemented in CombineTiers. Always will throw an error

<i>Overrides [TierContract.setTier](./tiercontract.md#setTier-property)</i>

<b>Signature:</b>

```typescript
readonly setTier: (account: string, endTier: BigNumberish, data: BytesLike, overrides?: TxOverrides | undefined) => Promise<never>;
```
