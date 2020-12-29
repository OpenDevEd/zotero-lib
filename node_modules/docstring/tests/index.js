// -*- coding: utf-8; indent-tabs-mode: nil; tab-width: 4; c-basic-offset: 4; -*-

/**
 * Tests for __doc__
 *
 * @author Alexander Abashkin <monolithed@gmail.com>
 * @license MIT
*/


'use strict';

var assert = require('assert');

// /** */
// --------------------------------------------

test('/** */', function () {
	var test = function () {
		/** text */
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/** */', function () {
	var test = function () {
	/** text */
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/** */', function () {
	var test = function () {
	/** text */

		void function () {
			/** ... */
		};
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/** */', function () {
	var test = function () {
		/** text */

		void function () {
			/** ... */
		};
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/** */', function () {
	var test = function () {
		/**
		text
		*/
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t\t');
});

test('/** */', function () {
	var test = function () {
	/**
	text
	*/
	};

	assert.equal(test.__doc__, '\n\ttext\n\t');
});

test('/** */', function () {
	var test = function () {
	/**
		text
	*/
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t');
});

test('/** */', function () {
	var test = function () {
	/**
		text
		...
	*/
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t\t...\n\t');
});

test('/** */', function () {
	var test = function () {
	/**
		text
		...
	*/
		void function () {
			/**
			...
			*/
		};
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t\t...\n\t');
});

test('/** */', function () {
	var test = function () {
		/** text */
		/** ... */
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/** */', function () {
	var test = function () {
		/** text */
		/** ... */

		void function () {
			/** ... */
		};
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/** */', function () {
	var test = function () {
		/**
		text
		*/
		/**
		...
		*/
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t\t');
});

test('/** */', function () {
	var test = function () {
		/**
		text
		*/
		/**
		...
		*/

		void function () {
			/**
			...
			*/
		};
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t\t');
});


// /*! */
// --------------------------------------------

test('/*! */', function () {
	var test = function () {
		/*! text */
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/*! */', function () {
	var test = function () {
	/*! text */
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/*! */', function () {
	var test = function () {
	/*! text */

		void function () {
			/*! ... */
		};
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/*! */', function () {
	var test = function () {
		/*! text */

		void function () {
			/** ... */
		};
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/*! */', function () {
	var test = function () {
		/*!
		text
		*/
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t\t');
});

test('/*! */', function () {
	var test = function () {
	/*!
	text
	*/
	};

	assert.equal(test.__doc__, '\n\ttext\n\t');
});

test('/*! */', function () {
	var test = function () {
	/*!
		text
	*/
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t');
});

test('/*! */', function () {
	var test = function () {
	/*!
		text
		...
	*/
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t\t...\n\t');
});

test('/*! */', function () {
	var test = function () {
	/*!
		text
		...
	*/
		void function () {
			/*!
			...
			*/
		};
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t\t...\n\t');
});

test('/*! */', function () {
	var test = function () {
		/*! text */
		/*! ... */
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/*! */', function () {
	var test = function () {
		/*! text */
		/*! ... */

		void function () {
			/*! ... */
		};
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/*! */', function () {
	var test = function () {
		/*!
		text
		*/
		/*!
		...
		*/
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t\t');
});

test('/*! */', function () {
	var test = function () {
		/*!
		text
		*/
		/*!
		...
		*/

		void function () {
			/*!
			...
			*/
		};
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t\t');
});


// /*! */ | /** */
// --------------------------------------------

test('/*! */ | /** */', function () {
	var test = function () {
		/*! text */
		/** ... */
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/*! */ | /** */', function () {
	var test = function () {
	/*! text */
	/** ... */

		void function () {
			/*! ... */
		};
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/*! */ | /** */', function () {
	var test = function () {
		/*! text */
		/** ... */

		void function () {
			/*! ... */
			/** ... */
		};
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/*! */ | /** */', function () {
	var test = function () {
		/*!
		text
		*/
		/**
		...
		*/
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t\t');
});

test('/*! */ | /** */', function () {
	var test = function () {
	/*!
	text
	*/
	/**
	...
	*/
	};

	assert.equal(test.__doc__, '\n\ttext\n\t');
});

test('/*! */ | /** */', function () {
	var test = function () {
	/*!
		text
	*/
	/**
		...
	*/
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t');
});

test('/*! */ | /** */', function () {
	var test = function () {
	/*!
		text
		...
	*/
	/**
		...
		...
	*/
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t\t...\n\t');
});

test('/*! */ | /** */', function () {
	var test = function () {
	/*!
		text
		...
	*/
	/**
		text
		...
	*/
		void function () {
			/*!
			...
			*/
		};
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t\t...\n\t');
});

test('/*! */ | /** */', function () {
	var test = function () {
		/*! text */
		/** ... */
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/*! */ | /** */', function () {
	var test = function () {
		/*! text */
		/** ... */

		void function () {
			/** ... */
		};
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/*! */ | /** */', function () {
	var test = function () {
		/*!
		text
		*/
		/**
		...
		*/
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t\t');
});

test('/*! */ | /** */', function () {
	var test = function () {
		/*!
		text
		*/
		/**
		...
		*/

		void function () {
			/*!
			...
			*/
			/**
			...
			*/
		};
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t\t');
});


// /*! */ | /** */
// --------------------------------------------

test('/** */ | /*! */', function () {
	var test = function () {
		/** text */
		/*! ... */
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/** */ | /*! */', function () {
	var test = function () {
	/** text */
	/*! ... */

		void function () {
			/*! ... */
		};
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/** */ | /*! */', function () {
	var test = function () {
		/** text */
		/*! ... */

		void function () {
			/** ... */
			/*! ... */
		};
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/** */ | /*! */', function () {
	var test = function () {
		/**
		text
		*/
		/*!
		...
		*/
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t\t');
});

test('/** */ | /*! */', function () {
	var test = function () {
	/**
	text
	*/
	/*!
	...
	*/
	};

	assert.equal(test.__doc__, '\n\ttext\n\t');
});

test('/** */ | /*! */', function () {
	var test = function () {
	/**
		text
	*/
	/*!
		...
	*/
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t');
});

test('/** */ | /*! */', function () {
	var test = function () {
	/**
		text
		...
	*/
	/*!
		...
		...
	*/
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t\t...\n\t');
});

test('/** */ | /*! */', function () {
	var test = function () {
	/**
		text
		...
	*/
	/*!
		...
		...
	*/
		void function () {
			/*!
			...
			*/
		};
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t\t...\n\t');
});

test('/** */ | /*! */', function () {
	var test = function () {
		/** text */
		/*! ... */
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/** */ | /*! */', function () {
	var test = function () {
		/** text */
		/*! ... */

		void function () {
			/** ... */
		};
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/** */ | /*! */', function () {
	var test = function () {
		/**
		text
		*/
		/*!
		...
		*/
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t\t');
});

test('/** */ | /*! */', function () {
	var test = function () {
		/**
		text
		*/
		/*!
		...
		*/

		void function () {
			/**
			...
			*/
			/*!
			...
			*/
		};
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t\t');
});


// /** */ | /*! */ | /* */ | //
// --------------------------------------------

test('/** */ | /*! */ | /* */ | // ', function () {
	var test = function () {
		/** text */
		/*! ... */
		/* ... */
		// ...
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/** */ | /*! */ | /* */ | // ', function () {
	var test = function () {
	/** text */
	/*! ... */
	/* ... */
	// ...
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/** */ | /*! */ | /* */ | // ', function () {
	var test = function () {
		/** text */
		/*! ... */
		/* ... */
		// ...

		void function () {
			/** text */
			/*! ... */
			/* ... */
			// ...
		};
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/** */ | /*! */ | /* */ | // ', function () {
	var test = function () {
	/** text */
	/*! ... */
	/* ... */
	// ...

		void function () {
			/** text */
			/*! ... */
			/* ... */
			// ...
		};
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/** */ | /*! */ | /* */ | // ', function () {
	var test = function () {
		/**
		text
		*/
		/*!
		...
		*/
		/*
		...
		*/
		/*
		...
		*/
		// ...
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t\t');
});

test('/** */ | /*! */ | /* */ | // ', function () {
	var test = function () {
	/**
	text
	*/
	/*!
	...
	*/
	/*
	...
	*/
	/*
	...
	*/
	// ...
	};

	assert.equal(test.__doc__, '\n\ttext\n\t');
});

test('/** */ | /*! */ | /* */ | // ', function () {
	var test = function () {
		/**
			text
		*/
		/*!
			...
		*/
		/*
			...
		*/
		/*
			...
		*/
		//  ...
	};

	assert.equal(test.__doc__, '\n\t\t\ttext\n\t\t');
});

test('/** */ | /*! */ | /* */ | // ', function () {
	var test = function () {
	/**
		text
		...
	*/
	/*!
		...
		...
	*/
	/*
		...
		...
	*/
	/*
		...
		...
	*/
	//	...
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t\t...\n\t');
});

test('/** */ | /*! */ | /* */ | // ', function () {
	var test = function () {
	/**
		text
		...
	*/
	/*!
		...
		...
	*/
	/*
		...
		...
	*/
	/*
		...
		...
	*/
	//	...

		void function () {
			/**
				text
				...
			*/
			/*!
				...
				...
			*/
			/*
				...
				...
			*/
			/*
				...
				...
			*/
			//	...
		};
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t\t...\n\t');
});


// // | /** */ | /* */ | | /*! */
// --------------------------------------------

test('/** */ | /*! */ | /* */ | // ', function () {
	var test = function () {
		// ...
		/** text */
		/* ... */
		/*! ... */
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/** */ | /*! */ | /* */ | // ', function () {
	var test = function () {
	// ...
	/** text */
	/* ... */
	/*! ... */
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/** */ | /*! */ | /* */ | // ', function () {
	var test = function () {
		// ...
		/** text */
		/* ... */
		/*! ... */

		void function () {
			// ...
			/** text */
			/* ... */
			/*! ... */
		};
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/** */ | /*! */ | /* */ | // ', function () {
	var test = function () {
	// ...
	/** text */
	/* ... */
	/*! ... */

		void function () {
			// ...
			/** text */
			/* ... */
			/*! ... */
		};
	};

	assert.equal(test.__doc__, '\u0020text\u0020');
});

test('/** */ | /*! */ | /* */ | // ', function () {
	var test = function () {
		// ...
		/**
		text
		*/
		/*
		...
		*/
		/*
		...
		*/
		/*!
		...
		*/
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t\t');
});

test('/** */ | /*! */ | /* */ | // ', function () {
	var test = function () {
	// ...
	/**
	text
	*/
	/*
	...
	*/
	/*
	...
	*/
	/*!
	...
	*/
	};

	assert.equal(test.__doc__, '\n\ttext\n\t');
});

test('/** */ | /*! */ | /* */ | // ', function () {
	var test = function () {
		//  ...
		/**
			text
		*/
		/*
			...
		*/
		/*
			...
		*/
		/*!
			...
		*/
	};

	assert.equal(test.__doc__, '\n\t\t\ttext\n\t\t');
});

test('/** */ | /*! */ | /* */ | // ', function () {
	var test = function () {
	//	...
	/**
		text
		...
	*/
	/*!
		...
		...
	*/
	/*
		...
		...
	*/
	/*
		...
		...
	*/
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t\t...\n\t');
});

test('/** */ | /*! */ | /* */ | // ', function () {
	var test = function () {
	//	...
	/**
		text
		...
	*/
	/*!
		...
		...
	*/
	/*
		...
		...
	*/
	/*
		...
		...
	*/

		void function () {
			//	...
			/**
				text
				...
			*/
			/*!
				...
				...
			*/
			/*
				...
				...
			*/
			/*
				...
				...
			*/
		};
	};

	assert.equal(test.__doc__, '\n\t\ttext\n\t\t...\n\t');
});


// Empty string
// --------------------------------------------

test(' ', function () {
	var test = function () {

	};

	assert.equal(test.__doc__, '');
});

test('/***/', function () {
	var test = function () {
		/***/
	};

	assert.equal(test.__doc__, '');
});

test('/** */', function () {
	var test = function () {
		/** */
	};

	assert.equal(test.__doc__, ' ');
});

test('/*! */', function () {
	var test = function () {
		/*! */
	};

	assert.equal(test.__doc__, ' ');
});

test('/* */', function () {
	var test = function () {
		/* */
	};

	assert.equal(test.__doc__, '');
});

test('/* */', function () {
	var test = function () {
		/* */
	};

	assert.equal(test.__doc__, '');
});

test('/***.../', function () {
	var test = function () {
		/***/
		/*!*/
		/**/
		//
	};

	assert.equal(test.__doc__, '');
});

test('/** *.../', function () {
	var test = function () {
		/** */
		/*! */
		/* */
		//
	};

	assert.equal(test.__doc__, ' ');
});
