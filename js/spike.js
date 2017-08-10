{
	"id": {"type": "text", "minlength": 1, "maxlength": 16, "required": ""},
	"transactionIdentification": {"type": "text", "minlength": 1, "maxlength": 16, "required": ""},
	"movementType": {"select": ["RECE","DELI"], "required": ""},
	"payment": {"select": ["AMPT","FREE"], "required": ""},
	"linkages": {
		"prev": {
			"transactionIdentification": {"type": "text", "minlength": 1, "maxlength": 16}
		},
		"with": {
			"transactionIdentification": {"type": "text", "minlength": 1, "maxlength": 16}
		}
	},
      "placeOfTrade":{
         "select":[
            "XHEL",
            "XSTO",
            "BURG",
            "XLON",
            "CHIX",
            "XOFF",
            "XOTC",
            "XXXX",
            "VARI"
         ], "required": ""},
	"tradeDate": {"type": "date", "required": ""},
	"settlementDate": {"type": "date", "required": ""},
	"matchingStatus": {"select": ["NMAT","MACH"], "required": ""},
	"ISIN": {"type": "text", "minlength": 12, "maxlength": 12, "required": ""},
	"quantity": {"type": "number", "min": 0, "max": 999999999999999, "maxlength": 15, "required": ""},
	"safekeepingAccount": {"type": "text", "minlength": 8, "maxlength": 35, "required": ""},
	"transactionType": {

      "transactionType":{
         "select":[
            "TRAD",
            "NETT",
            "PLAC",
            "OWNI",
            "OWNE",
            "COLI",
            "COLO",
            "SUBS",
            "REDM"
         ]


        "required": ""},
	"nettingEligibility": {"type": "checkbox"},
	"receiving": {
		"depository": {
            "BIC": {"type": "text", "minlength": 8, "maxlength": 11, "required": ""}
		},
		"party1": {
            "BIC": {"type": "text", "minlength": 8, "maxlength": 11, "required": ""}
		},
		"party2": {
            "BIC": {"type": "text", "minlength": 8, "maxlength": 11, "required": ""},
			"safekeepingAccount": {"type": "text", "minlength": 7, "maxlength": 35}
		}
	},
	"delivering": {
		"depository": {
            "BIC": {"type": "text", "minlength": 8, "maxlength": 11, "required": ""}
		},
		"party1": {
            "BIC": {"type": "text", "minlength": 8, "maxlength": 11, "required": ""}
		},
		"party2": {
            "BIC": {"type": "text", "minlength": 8, "maxlength": 11, "required": ""},
			"safekeepingAccount": {"type": "text", "minlength": 7, "maxlength": 35}
		}
	},
	"creditDebit":{"select": ["CRDT","DBIT"], "required": ""},
	"amount": {"type": "number", "min": 0, "max": 999999999999999,  "step": "any", "maxlength": 15, "required": ""},
    "currency": {"select": models.currencies, "required": ""},
	"investor": {
		"id": {"type": "text", "minlength": 1, "maxlength": 16},
		"safekeepingAccount": {"type": "text", "minlength": 7, "maxlength": 35},
	    "cashAccount": {"type": "text", "minlength": 7, "maxlength": 35}
	}
}
