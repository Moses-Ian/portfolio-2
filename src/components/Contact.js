import React, { useState, useEffect } from 'react';
import { useSpring, useTransition, config, animated } from "react-spring";
import {useMedia} from 'react-use';
import { validateEmail } from '../utils/helpers';
import Title from './Title';

const heightDefault = 357;	//height on my screen
const heightError = 407;		//height on my screen
const heightDict = {
	large: 357,	//height on my screen
	largeErr: 407,	//height on my screen
	medium: 357,
	mediumErr: 407,
	small: 357,
	smallErr: 407,
	xsmall: 385,
	xsmallErr: 437
};

const Contact = ({nextArticle, setArticle}) => {
	
	//height can change
	const isMedium = useMedia('(max-width: 980px)');
	const isSmall  = useMedia('(max-width: 768px)');
	const isXSmall = useMedia('(max-width: 576px)');
	
	function calcHeight(err=false) {
		let h;
		if(err) {
			if (isXSmall)
				h = heightDict['xsmallErr'];
			else if (isSmall)
				h = heightDict['smallErr'];
			else if (isMedium)
				h = heightDict['mediumErr'];
			else
			h = heightDict['largeErr'];
		} else {
			if (isXSmall)
				h = heightDict['xsmall'];
			else if (isSmall)
				h = heightDict['small'];
			else if (isMedium)
				h = heightDict['medium'];
			else
				h = heightDict['large'];
		}
		return h;
	}

	const [height, setHeight] = useState(calcHeight());
	
	//error message nonsense
	const [errorMessage, setErrorMessage] = useState('');
	const [formState, setFormState] = useState({ name: '', email: '', message: '' });
	const { name, email, message } = formState;
	
	function handleChange(e) {

		let err = '';
		switch (e.target.name) {
			case 'name':
				if (!e.target.value.length)
					err = 'Name is required.';
				break;
			case 'email':
				if (!validateEmail(e.target.value))
					err = 'Your email is invalid.';
				break;
			case 'message':
				if (!e.target.value.length)
					err = 'Message is required.';
				break;
		}

		setErrorMessage(err);

		if (!errorMessage) {
			setFormState({ ...formState, [e.target.name]: e.target.value });
		}
		
		setHeight(calcHeight(err));
	}
	
	function handleSubmit(e) {
		e.preventDefault();
		console.log(formState);
	}
	
	//animation nonsense
	const visible = nextArticle === 'contact';

  const fadeStyles = useSpring({
    config: { ...config.molasses },
    from: { opacity: 0 },
    to: {
      opacity: visible ? 1 : 0
    },
		leave: { opacity: 0 }
  });
	
  const slideInStyles = useSpring({
    config: { ...config.wobbly },
    from: { opacity: 0, height: 0 },
    to: {
      opacity: visible ? 1 : 0,
      height: visible ? height : 0
    }
  });

	useEffect(() => {
		setTimeout(() => setArticle(nextArticle), 500);
	});

	return (
		<animated.article style={slideInStyles}>
			<Title title='Contact Me' visible={visible} />
			<animated.div style={fadeStyles}>
				<form id="contact-form" className="contact-form" onSubmit={handleSubmit}>
					<div>
						<label htmlFor="name">Name:</label>
						<input type="text" className="form-input" defaultValue={name} onBlur={handleChange} name="name" />
					</div>
					<div>
						<label htmlFor="email">Email address:</label>
						<input type="email" className="form-input" defaultValue={email} name="email" onBlur={handleChange} />
					</div>
					<div>
						<label htmlFor="message">Message:</label>
						<textarea className="form-input" name="message" defaultValue={message} onBlur={handleChange} rows="5" cols="30" />
					</div>
					{errorMessage && (
						<div>
							<p className="error-text">{errorMessage}</p>
						</div>
					)}
					<button type="submit" data-testid="submit">Contact Me</button>
				</form>
			</animated.div>
		</animated.article>
	)
};

export default Contact;