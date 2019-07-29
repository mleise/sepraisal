Space Engineers Praisal: CLI
================================================================================




## Status of Blueprint

Command Line Interface performs all backend functions. They perform one of the steps in the blueprint pipeline. To track status of blueprint a virtual properties is derived: `status`. Below at first indent are `status` possible values, and at second indent are reasons why blueprint is in given status. The order matters at both levels, and `status` value is the first value with truthy reason.

1. `pendingScrape`: Scrape Steam page for meta (version, mods, collections, and various stats).
   - `initial`: hasn't been scraped at all.
   - `outdated`: scraped with older version of algorithm.
   - `stale`: hasn't been scraped for a week.
   - `error`: tried to scrape but got error.
2. `pendingThumb`: Download and put into cache thumbnail of mod.
   - `initial`: doesn't have a thumb.
   - `outdated`: thumbed with older version of algorithm.
   - `stale`: is known to have newer thumb but thumb not updated yet.
   - `error`: tried to thumb but got error.
3. `pendingPraise`: Praise Blueprint (grids, blocks, ingots, ores - grouped and summarized).
   - `initial`: doesn't have the praisal.
   - `outdated`: thumbed with older version of algorithm.
   - `stale`: is known to have newer sbc but praisal is not updated yet.
   - `error`: tried to praise but got error.
4. `pendingClass`: Categorize Blueprint against classes and sub-classes.
   - `initial`: doesn't have classes.
   - `outdated`: classified with older version of algorithm *or* against previous era.
   - `stale`: is known to have changed but classes are not updated yet.
   - `error`: tried to classify but got error.
5. `ok`: nothing to do.




## Data

Each praised blueprint has a calculated freshness (in the given order):

1. `stale`: hasn't been scraped for a week.
2. `outdated`: has a newer version but is not yet re-praised.
3. `inaccurate`: has been praised with older algorithm and is not yet re-praised.
4. `oldschool`: has been classified against previous era and is not yet reclassified.
5. `ok`: Everything's ok (freshness equals to pipeline progress)




## Routines

| Routine      | Related Status  | Summary |
| ------------ | --------------- | ------- |
| `info`       | N/A             | prints human-readable databse summary of all blueprints and their states. |
| `discover`   | N/A             | Check 1670 steam blueprint pages with 30 items each (steam limit) and save newly found IDs. |
| `scrape`     | `pendingScrape` | Look at Steam page of blueprint to save and analyze everything. |
| `thumbnail`  | `pendingThumb`  | Download thumbnail for mods from Steam and converts to `.webp` format. |
| `cache`      | `pendingPraise` | Use steamcmd and Steam account with SE to locally download newest version of mods. |
| `praise`     | `pendingPraise` | Parse blueprint `.sbc` file to count and analyze everything. |
| `categorize` | N/A             | Create categories using Big Data of 25k+ blueprints, R language and pragmatic common sense. |
| `classify`   | `pendingClass`  | Make a score how good the blueprint fits into one of classes. |

Summary of routines are at table above, and few that need more details have their sections below.


### Script `categorize.ts`

*TL;DR*: Create categories using Big Data of 25k+ blueprints, R language and pragmatic common sense.

There's 3 things

- MongoDB that store data for free,
- R that does math right,
- and Javascript scripts that glues everything together.

The trick is how to call R from Javascript, and there OpenCPU comes to the rescue. It basically provides REST API on top of R, and Javascript will just query the endpoints.

#### 1. Install OpenCPU

Links: [Download](https://www.opencpu.org/download.html) and [API](https://www.opencpu.org/api.html)

TL;DR
```sh
# Install Docker if not.
docker run --name ocpu -t -p 8004:8004 opencpu/rstudio

# Install packages in R.
docker exec -i -t ocpu /bin/bash
R
```

```R
install.packages('zoo')
install.packages('MASS')
install.packages('fitdistrplus')
install.packages('logitnorm')
install.packages('extraDistr')
install.packages('invgamma')
```

```sh
docker start ocpu  # Start again.
docker stop ocpu  # Stop when not needed.
docker logs -f ocpu  # See logs.
```


#### 2. Run

```sh
yarn run ts-node src/classify.ts
```