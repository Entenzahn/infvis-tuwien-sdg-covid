import pandas as pd

df_vac = pd.read_csv("data/covid_vaccine_statewise.csv")
df_cov = pd.read_csv("data/covid_19_india.csv")
df_test = pd.read_csv("data/StatewiseTestingDetails.csv")
df_sdg = pd.read_excel("data/rawPovertyRateData.xlsx", engine="openpyxl")
df_statenames = pd.read_excel("data/jsonStateNamesIDs.xlsx", engine="openpyxl", skiprows=1)

print(df_sdg)
print(df_statenames)
df_statenames = df_statenames.replace('\n','',regex=True)

print(df_vac)
print(df_cov)
print(df_test)

df = pd.merge(df_sdg, df_statenames, how="inner", left_on="States/UTs", right_on = "Complete name")

df.to_json(r'../static/data/sdg.json')

