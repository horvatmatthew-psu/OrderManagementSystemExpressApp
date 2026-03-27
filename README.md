# OrderManagementSystemExpressApp
Repository For Module 9 Assignment to Create a Order Management System for CSC820

## Running Project Locally

1. npm install - install packages
2. npm run dev - launches application

*The application creates a sqlite database stored in the storage directory, that is gitignored, to keep the database local only.*


API documentation for Order App

Base URLs:

* <a href="http://localhost:3000">http://localhost:3000</a>

<h1 id="my-api-documentation-default">Default</h1>

## get__orders

> Code samples


```http
GET http://localhost:3000/orders HTTP/1.1
Host: localhost:3000
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/orders',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```


`GET /orders`

*Gets list of all orders.*

Gets a list of all orders..

> Example responses

> 200 Response

```json
{
  "success": true,
  "data": [
    {
      "id": 0,
      "customerName": "string",
      "orderDate": "2019-08-24T14:15:22Z",
      "totalAmount": 0.1,
      "status": "string"
    }
  ]
}
```

<h3 id="get__orders-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|A successful response|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal server error|Inline|

<h3 id="get__orders-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» data|[[Order](#schemaorder)]|false|none|none|
|»» id|integer|true|none|Unique identifier for the order|
|»» customerName|string|true|none|Name of the customer|
|»» orderDate|string(date-time)|true|none|Date when the order was placed|
|»» totalAmount|number(float)|true|none|Total amount of the order|
|»» status|string|true|none|Status of the order|

Status Code **500**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» message|string|false|none|none|
|» error|object|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## post__orders

> Code samples

```http
POST http://localhost:3000/orders HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "customerName": "string",
  "totalAmount": 0
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/orders',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});


`POST /orders`

*Create a new order*

Creates a new order with customer name and total amount

> Body parameter

```json
{
  "customerName": "string",
  "totalAmount": 0
}
```

<h3 id="post__orders-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» customerName|body|string|true|Name of the customer|
|» totalAmount|body|number|true|Total amount of the order|

> Example responses

> 201 Response

```json
{
  "success": true,
  "message": "string"
}
```

<h3 id="post__orders-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Order created successfully|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Invalid request data|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal server error|Inline|

<h3 id="post__orders-responseschema">Response Schema</h3>

Status Code **201**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» message|string|false|none|none|

Status Code **400**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» error|string|false|none|none|
|» details|array|false|none|none|

Status Code **500**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» message|string|false|none|none|
|» error|object|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## get__orders_{id}

> Code samples


```http
GET http://localhost:3000/orders/{id} HTTP/1.1
Host: localhost:3000
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/orders/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /orders/{id}`

*Get order by ID*

Retrieves a specific order by its ID

<h3 id="get__orders_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|The order ID|

> Example responses

> 200 Response

```json
{
  "success": true,
  "data": {
    "id": 0,
    "customerName": "string",
    "orderDate": "2019-08-24T14:15:22Z",
    "totalAmount": 0.1,
    "status": "string"
  }
}
```

<h3 id="get__orders_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Order found|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Order not found|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal server error|Inline|

<h3 id="get__orders_{id}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» data|[Order](#schemaorder)|false|none|none|
|»» id|integer|true|none|Unique identifier for the order|
|»» customerName|string|true|none|Name of the customer|
|»» orderDate|string(date-time)|true|none|Date when the order was placed|
|»» totalAmount|number(float)|true|none|Total amount of the order|
|»» status|string|true|none|Status of the order|

Status Code **404**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» message|string|false|none|none|

Status Code **500**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» message|string|false|none|none|
|» error|object|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## delete__orders_{id}

> Code samples

```http
DELETE http://localhost:3000/orders/{id} HTTP/1.1
Host: localhost:3000
Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/orders/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /orders/{id}`

*Delete order by ID*

Deletes a specific order by its ID

<h3 id="delete__orders_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|The order ID|

> Example responses

> 404 Response

```json
{
  "success": true,
  "message": "string"
}
```

<h3 id="delete__orders_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Order deleted successfully|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Order not found|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal server error|Inline|

<h3 id="delete__orders_{id}-responseschema">Response Schema</h3>

Status Code **404**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» message|string|false|none|none|

Status Code **500**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» message|string|false|none|none|
|» error|object|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## patch__orders_{id}

> Code samples

```http
PATCH http://localhost:3000/orders/{id} HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "customerName": "string",
  "totalAmount": 0
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/orders/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PATCH /orders/{id}`

*Update order by ID*

Partially updates a specific order by its ID

> Body parameter

```json
{
  "customerName": "string",
  "totalAmount": 0
}
```

<h3 id="patch__orders_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|The order ID|
|body|body|object|true|none|
|» customerName|body|string|false|Name of the customer|
|» totalAmount|body|number|false|Total amount of the order|

> Example responses

> 200 Response

```json
{
  "success": true,
  "data": {
    "id": 0,
    "customerName": "string",
    "orderDate": "2019-08-24T14:15:22Z",
    "totalAmount": 0.1,
    "status": "string"
  }
}
```

<h3 id="patch__orders_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Order updated successfully|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Order not found|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal server error|Inline|

<h3 id="patch__orders_{id}-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» data|[Order](#schemaorder)|false|none|none|
|»» id|integer|true|none|Unique identifier for the order|
|»» customerName|string|true|none|Name of the customer|
|»» orderDate|string(date-time)|true|none|Date when the order was placed|
|»» totalAmount|number(float)|true|none|Total amount of the order|
|»» status|string|true|none|Status of the order|

Status Code **404**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» message|string|false|none|none|

Status Code **500**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» success|boolean|false|none|none|
|» message|string|false|none|none|
|» error|object|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_Order">Order</h2>
<!-- backwards compatibility -->
<a id="schemaorder"></a>
<a id="schema_Order"></a>
<a id="tocSorder"></a>
<a id="tocsorder"></a>

```json
{
  "id": 0,
  "customerName": "string",
  "orderDate": "2019-08-24T14:15:22Z",
  "totalAmount": 0.1,
  "status": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer|true|none|Unique identifier for the order|
|customerName|string|true|none|Name of the customer|
|orderDate|string(date-time)|true|none|Date when the order was placed|
|totalAmount|number(float)|true|none|Total amount of the order|
|status|string|true|none|Status of the order|

