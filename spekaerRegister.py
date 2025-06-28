from typing import TypedDict
import asyncpg
import dotenv,os
import aiohttp,asyncio
from operator import itemgetter

dotenv.load_dotenv()

class NameType(TypedDict):
    name: str

class SpeakerType(TypedDict):
    id: int
    name: str
    styles: list[NameType]






# async def main():
#     response: SpeakerType | None  = None

#     async with aiohttp.ClientSession() as session:
#         async with session.get('http://localhost:50021/speakers', headers={"Content-Type": "application/json"}) as res:
#             response: list[SpeakerType] = await res.json()

#     if not response: return

#     values: list[SpeakerType] = []

#     for i, res in enumerate(response,0):
#         names = list(map(itemgetter("name"), res["styles"]))
  
#         values.append({
#             "id": i,
#             "name": res["name"],
#             "styles": names
#         })

#     records = [(v["id"],v["name"],v["styles"]) for v in values]
#     print(values)
#     pool = await asyncpg.create_pool(dsn=os.environ.get("POSTGRESQL_URL"))
#     async with pool.acquire() as conn:
#         async with conn.transaction():
#             await conn.executemany( "insert into tts.speaker_emotion_master (id, name,styles) values ($1,$2,$3)", records)

async def main():
    emotions=["喜び","怒り","悲しみ"]

    values = [
        {
            "id": 33,
            "name": "男性1",
            "styles": emotions
        },
        {
            "id": 34,
            "name": "男性2",
            "styles": emotions
        },
        {
            "id": 35,
            "name": "女性1",
            "styles": emotions
        },
        {
            "id": 37,
            "name": "女性2",
            "styles": emotions
        },
        {
            "id": 38,
            "name": "サンタ",
            "styles": emotions
        },
        {
            "id": 39,
            "name": "熊",
            "styles": emotions
        },
    ]

    records = [(v["id"],v["name"],v["styles"]) for v in values]


    pool = await asyncpg.create_pool(dsn=os.environ.get("POSTGRESQL_URL"))

    async with pool.acquire() as conn:
        async with conn.transaction():
            await conn.executemany( "insert into tts.speaker_emotion_master (id, name,styles) values ($1,$2,$3)", records)





asyncio.run(main())