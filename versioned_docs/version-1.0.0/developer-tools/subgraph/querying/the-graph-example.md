---
layout: single
title:  "Rain Protocol: The Graph Example"
date:   2022-02-03 12:00:23 +0000
categories: development
---

## GraphQL

As mentioned in our [previous article][previous-article], The Rain Protocol is no exception when it comes to data needing to be indexed, and the team have been building out a [Subgraph][subgraph] using [The Graph][the-graph] in order to make retrieval of meaningful information quick and easy. If you don't quite get why indexing is important, check out the [previous article][graph-overview] which gives an overview of the Graph.

Querying a Subgraph involves using a query language called [GraphQL][graph-ql]; this language is not specific to The Graph protocol, and is not even specific to Blockchain based systems. When writing GraphQL, a developer will specify the exact data required in a JSON-like format: `{ platform { name } }` which would return: `{ "platform": { "name": "Rain Protocol" } }`.

## Examples using Rain Subgraph

The 'Playground' tab under the [Subgraph Explorer][subgraph] can be used to let developers experiment with available data and queries via an easy to use GUI. This can also be done easily using an API tool such as [Postman][postman]. To use this, queries should be put into the 'Body', the Method set to `POST`, and then GraphQL selected:


![Seed Phase](https://assets.unegma.net/rainprotocol.xyz/blog/postman-example.jpg "Seed Phase")

### The Code

Let's look at coding up an example. Getting the syntax correct when starting off with GraphQL can be a bit annoying. For this reason, we have been putting together some examples to go along with the our documentation over at [https://examples.rainprotocol.xyz][rain-examples] (check out the Github repo linked on the site for full code examples).

Whilst in Postman or on the [Subgraph Playground][subgraph], you will use a query such as this:

```
query {
    trustParticipants(first: 10) {
      id
      user
      tokenBalance
      seedBalance
    }
}
```

When it comes to coding in Javascript, you will need to include the query within a stringified JSON query parameter inside the body of the request like so:

```
let res = await fetch(`https://api.thegraph.com/subgraphs/name/beehive-innovation/rain-protocol`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: `
      query {
        trustParticipants(first: 10) {
          id
          user
          tokenBalance
          seedBalance
        }
      }
    `
  })
});

// the response will then come back as promise, the data of which will need to be accessed as such:
res = await res.json();
```

And to put everything together, to use the query within a framework such as React, you can use as follows:

```
import React, {useEffect, useState} from "react";

export default function TrustParticipantPage({}: any) {
  // create variable for storing the data using React State hook
  const [data, setData] = useState([]);

  // useEffect hook will be fired early on in the application life cycle, and the data will be fetched Asynchronously
  useEffect(() => {
    // this is calling the async function below and is the recommended way to do this for this scenario in React
    getData();
  }, [])

  // fetch the data asynchronously (this will fetch the first 10)
  async function getData() {
    let result = await fetch(`https://api.thegraph.com/subgraphs/name/beehive-innovation/rain-protocol`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            trustParticipants(first: 10) {
              id
              user
              tokenBalance
              seedBalance
            }
          }
        `
      })
    });

    res = await res.json();
    console.log(res);
    
    // if you are using Typescript, you might need to @ts-ignore here or create a type to describe the response data format
    // store the data in the variable above using useState hook
    setData(res.data.trustParticipants);
  }

  return (
    <div>
        <h1>Entity: TrustParticipant</h1>
    
        <h2>Result:</h2>
        {data.map((row: any) => (
          <div
            key={row.id}
          >
            <span>
              {row.user}
            </span>
            <span>{row.seedBalance}</span>
            <span>{row.tokenBalance}</span>
          </div>
        ))}
    </div>
  )
}

```

And that is it for our first example on how to integrate a GraphQL query into the Rain Subgraph in a Javascript based app.

As always, join the [Discord][discord] for more discussion and to connect with other devs, and feel free to reach out with any questions.

[graph-overview]: https://blog.rainprotocol.xyz/various/rain-protocol-the-graph-overview/
[the-graph]: https://thegraph.com/en/
[graph-ql]: https://graphql.org/
[subgraph]: https://thegraph.com/docs/en/developer/define-subgraph-hosted/
[rain-subgraph]: https://thegraph.com/hosted-service/subgraph/beehive-innovation/rain-protocol
[discord]: https://discord.gg/dzYS3JSwDP
[postman]: https://www.postman.com/
[rain-examples]: https://examples.rainprotocol.xyz/
[previous-article]: https://blog.rainprotocol.xyz/various/rain-protocol-the-graph-overview/
