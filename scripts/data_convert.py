import pandas as pd
import json
import numpy as np
import re

# Notes:
# Dadra and Nagar Haveli and Daman and Diu in Covid data set exist as separate Dadra and Nagar Haveli, Daman and Diu in SDG dataset.
#   What can we do here? We can't just take the average of their SDG measurements, but we also can't split up their COVID data.
#   For now they will be left out since they are quite small.
#
#Telangana: covid and sdg data, but not in map
#Ladakh: has covid data but no SDG, also not in map
#

# Load Covid-19 data
df_vac = pd.read_csv("data/covid_vaccine_statewise.csv")
df_inf = pd.read_csv("data/covid_19_india.csv")
df_test = pd.read_csv("data/StatewiseTestingDetails.csv")

def readExcel(sheetname):
        return pd.read_excel("data/rawPovertyRateData.xlsx", engine="openpyxl", sheet_name=sheetname, nrows=36,
                             skiprows=lambda x: x in [1, 1], header=0).drop(columns="SNO", errors="ignore")


sheet_names = ["SDG-1", "SDG-2", "SDG-3", "SDG-4", "SDG-5", "SDG-6", "SDG-7", "SDG-8", "SDG-9", "SDG-10", "SDG-11",
               "SDG-12", "SDG-13", "SDG-15", "SDG-16"]

sheet_names_full_dict = {
    "SDG-1": "SDG 1 - No Poverty",
    "SDG-2": "SDG 2 - Zero Hunger",
    "SDG-3": "SDG 3 - Good Health and Well-being",
    "SDG-4": "SDG 4 - Quality Education",
    "SDG-6": "SDG 6 - Clean Water and Sanitation",
    "SDG-8": "SDG 8 - Decent Work and Economic Growth",
    "SDG-9": "SDG 9 - Industry, Innovation and Infrastructure",
    "SDG-10": "SDG 10 - Reduced Inequality",
    "SDG-16": "SDG 16 - Peace and Justice Strong Institutions"
}

df_sdg_groups = {}
delete_cols = ["States/UTs",
               "Unnamed: 19",
               "Unnamed: 20",
               "Percentage of children under age 5 years who are stunted",
               "Rice, wheat and coarse cereals produced annually per unit area (Kg/Ha)",
               "Gender Parity Index for Higher education (18-23 years)",
               ]

# Read all sheets into dataframe and build select option dictionary
l_sdg = list()

#Build the entire dataframe + build the data structure for our dropdown menus
for i in range(0, (len(sheet_names))):
    sn = sheet_names[i]
    l_sdg.append(readExcel(sn))
    if sn in sheet_names_full_dict:
        tmp_df = readExcel(sn)
        for c in tmp_df.columns:
            if re.search(r'\s*\.1$', c) or c in delete_cols:
                tmp_df = tmp_df.drop(columns=[c])
            tmp_df = tmp_df.rename(columns={c: re.sub(r'\s+$', '', c)})
        df_sdg_groups[sheet_names_full_dict[sn]] = tmp_df.columns.tolist() # must be list to JSONify

with open("../static/data/select_dropdown_groups.json", "w") as fp:
    json.dump(df_sdg_groups, fp, indent=2)

df_sdg = l_sdg[0]
for i in range(1,len(l_sdg)):
    df_sdg = df_sdg.merge(l_sdg[i], how="inner", on=["States/UTs"])

# Load state name to Map ID dictionary
df_statenames = pd.read_excel("data/jsonStateNamesIDs.xlsx", engine="openpyxl", skiprows=1)

# Clean Excel linebreaks
df_statenames = df_statenames.replace('\n', '', regex=True)
df_sdg = df_sdg.replace(r'Null', np.nan ,regex=True)

# Join SDG dataframe with map IDs
df_sdg = pd.merge(df_sdg, df_statenames, how="inner", left_on="States/UTs", right_on="Dataset name").drop(columns=["Complete name"])
# Store the SDG info as JSON file, using map ID to index the indicator dictionary of the state

for c in df_sdg.columns:
    ct = re.sub(r'\s*\.1$', ' (Index)', c)
    ct = re.sub(r'\s+$', '', ct)
    df_sdg = df_sdg.rename(columns={c: ct})

df_sdg.set_index(df_sdg["ID name"]).to_json(r'../static/data/sdg.json', indent=2)

# To instead list indicators by country:
# df_sdg.set_index(df_sdg["ID name"]).transpose().to_json(r'../static/data/sdg.json')

# Transform date format to be in line with the other two dataframes

df_vac["Updated On"] = pd.to_datetime(df_vac["Updated On"], format="%d/%m/%Y").dt.strftime("%Y-%m-%d")

# Merge dataframes across (State, Date) tuples
df_cov = df_vac.merge(
    df_inf, how="outer", left_on=["State", "Updated On"], right_on=["State/UnionTerritory", "Date"]
)

df_cov["Updated On"] = df_cov["Updated On"].fillna(df_cov["Date"])

df_cov = df_cov.drop(columns=["State/UnionTerritory","Date"]).merge(
    df_test, how="outer", left_on=["State", "Updated On"], right_on=["State", "Date"]
)
df_cov["Updated On"] = df_cov["Updated On"].fillna(df_cov["Date"])

df_cov = df_cov.drop(columns=["Date"]).merge(
    df_statenames, how="inner", left_on="State", right_on="Dataset name"
).drop(columns=["Dataset name","Complete name"]).rename(columns={"Updated On":"Date"})


# Since we want to go "up to" a certain date, better to store the individual dated measurements in a sorted array.
# Be sure to convert NaN -> null
dict_cov_grp = df_cov \
    .where(pd.notnull(df_cov), None) \
    .groupby("ID name") \
    .apply(lambda x: sorted(
    x.to_dict('records'), key=lambda k: k["Date"])
           ).to_dict()

# If we want a straight dictionary State -> Date -> Data then use this:
# Many ways to create nested JSON, for instance group_by or set index and to_dict("index")
# dict_cov_grp = df_cov.where(pd.notnull(df_cov),None).groupby("State").apply(lambda x:x.set_index("Updated On").to_dict('index')).to_dict()

# Store JSON from Covid dict
with open("../static/data/covid.json", "w") as fp:
    json.dump(dict_cov_grp, fp, indent=2)

df_pop = pd.read_excel("data/population_by_state.xlsx", engine="openpyxl")
df_pop = df_pop.merge(df_statenames, left_on="State", right_on="Dataset name")
df_pop.set_index(df_pop["ID name"])["Total Population(Projected 2020)"].to_json(r'../static/data/pop.json', indent=2)

delete_cols_cov = ["ID name","DateUNIX","Sno","Time","ConfirmedIndianNational","ConfirmedForeignNational",
                   "Transgender(Individuals Vaccinated)","Negative","Positive","Updated On","Date","State","State/UnionTerritory"]
cov_select_dict = {"Vaccination data":[], "Testing data":[]}

for c in df_inf.columns:
    if c not in delete_cols_cov:
        cov_select_dict["Testing data"].append(c)
for c in df_test.columns:
    if c not in delete_cols_cov:
        cov_select_dict["Testing data"].append(c)
for c in df_vac.columns:
    if c not in delete_cols_cov:
        cov_select_dict["Vaccination data"].append(c)

with open("../static/data/covid_dropdown.json", "w") as fp:
    json.dump(cov_select_dict, fp, indent=2)