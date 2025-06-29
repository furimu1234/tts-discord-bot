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
    style: str






# async def main():
#     response: SpeakerType | None  = None

#     async with aiohttp.ClientSession() as session:
#         async with session.get('http://localhost:50021/speakers', headers={"Content-Type": "application/json"}) as res:
#             response: list[SpeakerType] = await res.json()

#     if not response: return

#     values: list[SpeakerType] = []

#     for i, res in enumerate(response,0):
#         for style in res["styles"]:
#             values.append({
#                 "id": style["id"],
#                 "name": res["name"],
#                 "style": style["name"]
#             })


  
#     records = [(v["id"],v["name"],v["style"]) for v in values]
 
#     pool = await asyncpg.create_pool(dsn=os.environ.get("POSTGRESQL_URL"))
#     async with pool.acquire() as conn:
#         async with conn.transaction():
#             await conn.executemany( "insert into tts.speaker_emotion_master (id, speaker,emotion) values ($1,$2,$3)", records)

async def main():
    speakers = ["男性1", "男性2", "女性1", "女性2", "サンタ","熊"]

    emotions=["喜び","怒り","悲しみ"]

    values = []

    for speaker in speakers:
        for emotion in emotions:
            values.append({
                "name": speaker,
                "style": emotion
            })



    records = [(i,v["name"],v["style"]) for i,v in enumerate(values, 500)]


    pool = await asyncpg.create_pool(dsn=os.environ.get("POSTGRESQL_URL"))

    async with pool.acquire() as conn:
        async with conn.transaction():
            await conn.executemany( "insert into tts.speaker_emotion_master (id, speaker,emotion) values ($1,$2,$3)", records)





asyncio.run(main())