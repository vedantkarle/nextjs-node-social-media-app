import axios from "axios";
import cookie from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Search } from "semantic-ui-react";
import baseUrl from "../../../utils/baseUrl";

let cancel;

const ChatListSearch = ({ chats, setChats }) => {
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [results, setResults] = useState([]);

	const handleChange = async e => {
		const { value } = e.target;

		if (value.trim().length === 0) return setQuery(value);

		setQuery(value);
		setLoading(true);

		try {
			cancel && cancel();
			const CancelToken = axios.CancelToken;
			const token = cookie.get("token");

			const res = await axios.get(`${baseUrl}/api/search/${query}`, {
				headers: { Authorization: token },
				cancelToken: new CancelToken(canceler => {
					cancel = canceler;
				}),
			});

			if (res?.data?.users?.length === 0) {
				results?.length > 0 && setResults([]);
				return setLoading(false);
			}

			const mappedResults = res?.data?.users?.map(result => ({
				_id: result._id,
				title: result.username,
				image: result.profilePicUrl,
			}));

			setResults(mappedResults);
		} catch (error) {
			console.error(error);
		}

		setLoading(false);
	};

	const router = useRouter();

	const addChat = async result => {
		const alreadyInChat =
			chats.length > 0 &&
			chats?.filter(chat => chat?.messagesWith === result._id).length > 0;

		if (alreadyInChat) {
			return router.push(`/messages?message=${result?._id}`);
		} else {
			const newChat = {
				messagesWith: result?._id,
				name: result?.title,
				profilePicUrl: result?.image,
				date: Date.now(),
			};
			setChats(prev => [newChat, ...prev]);

			router.push(`/messages?message=${result?._id}`);
		}
	};

	useEffect(() => {
		if (query.length === 0 && loading) {
			setLoading(false);
		}
	}, [query]);

	return (
		<div className='right'>
			<div className='users'>
				<div className='heading'>
					<h4>Users</h4>
				</div>
				<Search
					onBlur={() => {
						results?.length > 0 && setResults([]);
						loading && setLoading(false);
						setQuery("");
					}}
					loading={loading}
					placeholder='Search...'
					onSearchChange={handleChange}
					results={results}
					value={query}
					resultRenderer={ResultRenderer}
					minCharacters={1}
					onResultSelect={(e, data) => {
						addChat(data.result);
					}}
				/>
			</div>
		</div>
	);
};

const ResultRenderer = ({ title, image }) => {
	return (
		<div className='search-list' style={{ cursor: "pointer" }}>
			<img src={image} />
			<h5>{title}</h5>
		</div>
	);
};

export default ChatListSearch;
