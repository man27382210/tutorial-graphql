import * as React from 'react';
import { GetRaceWithSourceId, GetRaceWithSourceIdVariables } from './__generated__/types';
import { RACE_QUERY as QUERY } from './queries';
import { Query } from 'react-apollo';
import './race.css';

class RaceQuery extends Query<GetRaceWithSourceId, GetRaceWithSourceIdVariables> {}

interface RaceProps extends GetRaceWithSourceIdVariables{
  easyId: number;
}

const renderNoData:() => JSX.Element = (): JSX.Element  => <div>No data</div>;

export const Race: React.SFC<RaceProps> = props => {
  return (
    <RaceQuery query={QUERY} variables={props}>
      {({ loading, data, error }) => {
        if (loading) return <div>Loading</div>;
        if (error) return <h1>ERROR</h1>;
        if (!data) return renderNoData();
        const { race } = data;
        
        return (
          <div className="race-component">
            {race && race.map(
              oneRace =>
                oneRace && oneRace.contentsType && oneRace.contentsType.map(
                  contents => {
                    const lastElementIndex: number = contents!.targetContent!.length as number;
                    return contents && contents.targetContent && contents.targetContent.map(
                      (content, index) => {
                        const checkLastElement: boolean = lastElementIndex === index; 
                        const landingUrl: string = content!.landingUrl as string;
                        const bannerUrl: string = content!.bannerUrl as string;
                        const altString: string = content!.altString as string;
                        return content && (
                          <div key={`item-${index}`} className={`race-element ${checkLastElement ? 'clear' : ''}`}>
                            <img className='race-element-img' src={bannerUrl} alt={altString} />
                            <a href={landingUrl} />
                          </div>
                        )
                      }  
                    )
                  }
                    
                )
                  
            )}
          </div>
        );
      }}
    </RaceQuery>
  );
};

export default Race;
