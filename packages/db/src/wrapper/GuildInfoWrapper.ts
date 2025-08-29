import {
	type SchemaDB,
	createGuildInfo,
	getGuildInfo,
	type guildInfoFilter,
} from '..';

export type guildIdRequireInfoFilter = Partial<
	Omit<guildInfoFilter, 'guildId'>
> & {
	guildId: string;
};

export const getorCreateGuildInfoFindOne = async (
	db: SchemaDB,
	filter: guildIdRequireInfoFilter,
) => {
	const guildInfos = await getGuildInfo(db, filter);

	let guildInfo = guildInfos.find((x) => x.guildId === filter.guildId);

	if (!guildInfo) {
		const newId = await createGuildInfo(db, filter.guildId);
		[guildInfo] = await getGuildInfo(db, { id: newId });
	}

	return guildInfo;
};
